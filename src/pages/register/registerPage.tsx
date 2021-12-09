// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useState, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { FormikHelpers } from 'formik';
import { Container } from '../login/styles';
import { RegistrySteps } from './styles';
import RegisterView from './registerView';
import { RegisterStep } from './types';
import { indexerRegistry, indexerRequestApprove } from '../../utils/indexerActions';
import { useSigner, useWeb3 } from '../../hooks/web3Hook';
import { useContractSDK } from '../../containers/contractSdk';
import { useIsApproveChanged, useIsIndexerChanged } from '../../hooks/indexerHook';
import { ADD_INDEXER } from '../../utils/queries';
import { getStepIndex, getStepStatus, registerSteps } from './utils';
import { useInitialStep } from '../../hooks/registerHook';
import IndexerRegistryView from './indexerRegistryView';
import { cidToBytes32, IPFS } from '../../utils/ipfs';
import { RegisterFormKey, TRegisterValues } from '../../types/schemas';

const RegisterPage = () => {
  const { account } = useWeb3();
  const signer = useSigner();
  const sdk = useContractSDK();
  const history = useHistory();
  const initialStep = useInitialStep();
  const [addIndexer] = useMutation(ADD_INDEXER);
  const { request: checkIsApproveChanged } = useIsApproveChanged();
  const { request: checkIsIndexerChanged } = useIsIndexerChanged();

  const [currentStep, setStep] = useState<RegisterStep>(initialStep);
  const [loading, setLoading] = useState<boolean>(false);

  const isRegisterStep = useCallback(() => currentStep === RegisterStep.register, [currentStep]);

  // send tx actions
  const moveToNextStep = () => {
    setLoading(false);
    setStep(registerSteps[getStepIndex(currentStep) + 1] as RegisterStep);
  };

  // TODO: show alert when tx failed
  const onTransactionFailed = (error: Error) => {
    console.log('>>>tx failed:', error);
    setLoading(false);
  };

  const sendRequestApproveTx = () => {
    setLoading(true);
    checkIsApproveChanged(true, moveToNextStep);
  };

  const sendRegisterIndexerTx = () => {
    setLoading(true);
    checkIsIndexerChanged(true, moveToNextStep);
  };

  const syncIndexer = () => {
    setLoading(true);
    addIndexer({ variables: { indexer: account } })
      .then(() => {
        setLoading(false);
        history.push('/account');
      })
      .catch(() => setLoading(false));
  };

  const onIndexerRegister = async (
    values: TRegisterValues,
    helper: FormikHelpers<TRegisterValues>
  ) => {
    try {
      const { name, proxyEndpoint, amount } = values;
      // TODO: 1. validate `proxy endpoint`, default request `/discovery`;
      const result = await IPFS.add(JSON.stringify({ name, url: proxyEndpoint }), { pin: true });
      const cid = result.cid.toV0().toString();
      const metadataBytes = cidToBytes32(cid);
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
    [RegisterStep.sync]: syncIndexer,
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
      {!isRegisterStep() && (
        // @ts-ignore
        <RegisterView step={currentStep} loading={loading} onClick={registerActions[currentStep]} />
      )}
      {isRegisterStep() && <IndexerRegistryView loading={loading} onSubmit={onIndexerRegister} />}
    </Container>
  );
};

export default RegisterPage;
