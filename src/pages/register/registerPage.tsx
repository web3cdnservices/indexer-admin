// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { FormikHelpers } from 'formik';
import { isUndefined } from 'lodash';

import { useContractSDK } from 'containers/contractSdk';
import { useLoading } from 'containers/loadingContext';
import { useIsApproveChanged, useIsIndexer, useIsIndexerChanged } from 'hooks/indexerHook';
import { useInitialStep } from 'hooks/registerHook';
import { useSigner, useWeb3 } from 'hooks/web3Hook';
import { RegisterFormKey, TRegisterValues } from 'types/schemas';
import { indexerRegistry, indexerRequestApprove } from 'utils/indexerActions';
import { cidToBytes32, IPFS } from 'utils/ipfs';
import { ADD_INDEXER } from 'utils/queries';

import { Container } from '../login/styles';
import IndexerRegistryView from './indexerRegistryView';
import RegisterView from './registerView';
import { RegistrySteps } from './styles';
import { RegisterStep } from './types';
import { getStepIndex, getStepStatus, registerSteps } from './utils';

const RegisterPage = () => {
  const signer = useSigner();
  const { account } = useWeb3();
  const isIndexer = useIsIndexer();
  const sdk = useContractSDK();
  const history = useHistory();
  const initialStep = useInitialStep();
  const [addIndexer] = useMutation(ADD_INDEXER);
  const { setPageLoading } = useLoading();
  const { request: checkIsApproveChanged } = useIsApproveChanged();
  const { request: checkIsIndexerChanged } = useIsIndexerChanged();

  const [currentStep, setStep] = useState<RegisterStep>();
  const [loading, setLoading] = useState<boolean>(false);

  const isRegisterStep = useCallback(() => currentStep === RegisterStep.register, [currentStep]);

  useEffect(() => {
    setPageLoading(isUndefined(initialStep) || isUndefined(isIndexer));
    if (initialStep) setStep(initialStep);
    if (isIndexer) setStep(RegisterStep.sync);
  }, [initialStep, isIndexer]);

  const moveToNextStep = () => {
    setLoading(false);
    setStep(registerSteps[getStepIndex(currentStep) + 1] as RegisterStep);
  };

  // TODO: show alert when tx failed
  const onTransactionFailed = (error: Error) => {
    console.log('>>>tx failed:', error);
    setLoading(false);
  };

  const onSyncIndexer = async () => {
    setLoading(true);
    await addIndexer({ variables: { indexer: account } });
    setLoading(false);
    history.replace('/account');
  };

  const sendRequestApproveTx = () => {
    setLoading(true);
    checkIsApproveChanged(true, moveToNextStep);
  };

  const sendRegisterIndexerTx = () => {
    setLoading(true);
    checkIsIndexerChanged(true, onSyncIndexer);
  };

  const onIndexerRegister = async (
    values: TRegisterValues,
    helper: FormikHelpers<TRegisterValues>
  ) => {
    try {
      const { name, proxyEndpoint, amount } = values;
      const result = await IPFS.add(JSON.stringify({ name, url: proxyEndpoint }), { pin: true });
      const cid = result.cid.toV0().toString();
      const metadataBytes = cidToBytes32(cid);

      // TODO: 1. validate `proxy endpoint`, default request `/discovery`;
      helper.setErrors({ [RegisterFormKey.proxyEndpoint]: 'Invalid proxy endpoint' });

      await indexerRegistry(sdk, signer, amount.toString(), metadataBytes);

      sendRegisterIndexerTx();
    } catch (error) {
      onTransactionFailed(error as Error);
    }
  };

  const registerActions = {
    [RegisterStep.onboarding]: () => setStep(RegisterStep.authorisation),
    [RegisterStep.authorisation]: () =>
      indexerRequestApprove(sdk, signer, '1000000000')
        .then(sendRequestApproveTx)
        .catch(onTransactionFailed),
    [RegisterStep.register]: onIndexerRegister,
    [RegisterStep.sync]: onSyncIndexer,
  };

  const renderSteps = () => {
    if (currentStep === RegisterStep.onboarding) return null;
    const currentIndex = getStepIndex(currentStep);
    return (
      <RegistrySteps current={currentIndex}>
        {registerSteps.map((title, i) => (
          <RegistrySteps.Step key={title} status={getStepStatus(currentIndex, i)} title={title} />
        ))}
      </RegistrySteps>
    );
  };

  return (
    <Container>
      {renderSteps()}
      {currentStep && !isRegisterStep() && (
        // @ts-ignore
        <RegisterView step={currentStep} loading={loading} onClick={registerActions[currentStep]} />
      )}
      {currentStep && isRegisterStep() && (
        <IndexerRegistryView loading={loading} onSubmit={onIndexerRegister} />
      )}
    </Container>
  );
};

export default RegisterPage;
