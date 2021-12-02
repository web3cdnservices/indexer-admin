// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useState, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { useMutation } from '@apollo/client';
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
import IndexerRegistryView, { RegisterFormKey } from './indexerRegistryView';
import { FormValues } from '../../types/types';

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

  const onIndexerRegister = (values: FormValues) => {
    // FIXME: need to validate the form values
    const name = values[RegisterFormKey.name];
    // FIXME: amount at least `1000`
    const amount = values[RegisterFormKey.amount];
    const url = values[RegisterFormKey.endpoint];

    // TODO: uploadMedata { name, url } to ipfs
    const metadata = undefined;
    // send tx
    console.log('>>>values:', name, amount, url);
    return;
    indexerRegistry(sdk, signer, amount, metadata)
      .then(sendRegisterIndexerTx)
      .catch(onTransactionFailed);
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
      {isRegisterStep() && (
        <IndexerRegistryView loading={loading} onClick={registerActions[currentStep]} />
      )}
    </Container>
  );
};

export default RegisterPage;
