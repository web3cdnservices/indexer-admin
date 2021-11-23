// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { Container } from '../login/styles';
import { RegistrySteps } from './styles';
import RegisterView from './registerView';
import { RegisterStep, StepStatus } from './types';
import { indexerRegistry, indexerRequestApprove } from '../../utils/indexerActions';
import { useSigner, useWeb3 } from '../../hooks/web3Hook';
import { useContractSDK } from '../../containers/contractSdk';
import { useIsIndexer } from '../../hooks/indexerHook';
import { ADD_INDEXER } from '../../utils/queries';

const RegisterPage = () => {
  const { account } = useWeb3();
  const signer = useSigner();
  const sdk = useContractSDK();
  const history = useHistory();
  const isIndexer = useIsIndexer();
  const [addIndexer] = useMutation(ADD_INDEXER);

  const [currentStep, setStep] = useState<RegisterStep>(RegisterStep.onboarding);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setStep(isIndexer ? RegisterStep.sync : RegisterStep.onboarding);
  }, [isIndexer]);

  const registerSteps = Object.entries(RegisterStep)
    .map(([key]) => key)
    .slice(1);

  const isStep = (step: RegisterStep): boolean => currentStep === step;

  const currentIndex = (): number => registerSteps.findIndex((step) => step === currentStep);

  const getStepStatus = (currentIndex: number, index: number): StepStatus => {
    if (currentIndex === index) return StepStatus.process;
    if (currentIndex > index) return StepStatus.finish;
    return StepStatus.wait;
  };

  const moveToNextStep = () => {
    setStep(registerSteps[currentIndex() + 1] as RegisterStep);
    setLoading(false);
  };

  const onSendTransaction = () => {
    setLoading(true);
  };

  const onTransactionFailed = (errorMsg: string) => {
    setLoading(false);
  };

  const startRegistry = () => {
    setStep(RegisterStep.authorisation);
  };

  const requestAuthorisation = () => {
    // TODO: change amount to total SQT
    indexerRequestApprove(sdk, signer, '1000000000')
      .then(() => onSendTransaction())
      .catch((errorMsg) => onTransactionFailed(errorMsg));

    // TODO: request tx status, once complete switch to next step
    setTimeout(moveToNextStep, 5000);
  };

  const registerIndexer = () => {
    // TODO: amount from input
    indexerRegistry(sdk, signer, '10000')
      .then(() => onSendTransaction())
      .catch((errorMsg) => onTransactionFailed(errorMsg));

    // TODO: request tx status, once complete switch to next step
    setTimeout(moveToNextStep, 5000);
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

  const registerActions = {
    [RegisterStep.onboarding]: startRegistry,
    [RegisterStep.authorisation]: requestAuthorisation,
    [RegisterStep.register]: registerIndexer,
    [RegisterStep.sync]: syncIndexer,
  };

  const renderSteps = () => {
    if (isStep(RegisterStep.onboarding)) return null;
    const index = currentIndex();
    return (
      <RegistrySteps current={index}>
        {registerSteps.map((title, i) => (
          <RegistrySteps.Step key={title} status={getStepStatus(index, i)} title={title} />
        ))}
      </RegistrySteps>
    );
  };

  // TODO: as register step has forms, need to handle seperately

  return (
    <Container>
      {renderSteps()}
      <RegisterView step={currentStep} loading={loading} onClick={registerActions[currentStep]} />
    </Container>
  );
};

export default RegisterPage;
