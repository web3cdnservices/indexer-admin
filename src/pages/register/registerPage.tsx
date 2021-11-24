// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useState } from 'react';
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

  const registerActions = {
    [RegisterStep.onboarding]: () => setStep(RegisterStep.authorisation),
    [RegisterStep.authorisation]: () =>
      indexerRequestApprove(sdk, signer, '1000000000')
        .then(sendRequestApproveTx)
        .catch(onTransactionFailed),
    [RegisterStep.register]: () =>
      indexerRegistry(sdk, signer, '10000').then(sendRegisterIndexerTx).catch(onTransactionFailed),
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

  // TODO: as register step has forms, need to handle seperately
  return (
    <Container>
      {renderSteps()}
      <RegisterView step={currentStep} loading={loading} onClick={registerActions[currentStep]} />
    </Container>
  );
};

export default RegisterPage;
