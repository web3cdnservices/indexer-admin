// Copyright 2020-2022 SubQuery Pte Ltd authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { FormikHelpers } from 'formik';
import { isUndefined } from 'lodash';

import IntroductionView from 'components/introductionView';
import { useContractSDK } from 'containers/contractSdk';
import { useCoordinatorIndexer } from 'containers/coordinatorIndexer';
import { useLoading } from 'containers/loadingContext';
import { useToast } from 'containers/toastContext';
import { useIsIndexer, useTokenBalance } from 'hooks/indexerHook';
import { useInitialStep } from 'hooks/registerHook';
import { useSigner, useWeb3 } from 'hooks/web3Hook';
import { RegisterFormKey, TRegisterValues } from 'types/schemas';
import { indexerRegistry, indexerRequestApprove } from 'utils/indexerActions';
import { createIndexerMetadata } from 'utils/ipfs';

import { Container } from '../login/styles';
import IndexerRegistryView from './indexerRegistryView';
import prompts from './prompts';
import { RegistrySteps } from './styles';
import { RegisterStep } from './types';
import { getStepIndex, getStepStatus, registerSteps } from './utils';

const RegisterPage = () => {
  const signer = useSigner();
  const { account } = useWeb3();
  const isIndexer = useIsIndexer();
  const sdk = useContractSDK();
  const tokenBalance = useTokenBalance(account);
  const history = useHistory();
  const initialStep = useInitialStep();
  const { indexer: coordinatorIndexer, updateIndexer } = useCoordinatorIndexer();
  const { setPageLoading } = useLoading();
  const { dispatchToast } = useToast();

  const [currentStep, setStep] = useState<RegisterStep>();
  const [loading, setLoading] = useState<boolean>(false);

  const isRegisterStep = useCallback(() => currentStep === RegisterStep.register, [currentStep]);

  useEffect(() => {
    setPageLoading(isUndefined(initialStep) || isUndefined(isIndexer));
    if (initialStep) setStep(initialStep);
    if (isIndexer) setStep(RegisterStep.sync);
  }, [initialStep, isIndexer]);

  useEffect(() => {
    if (!account) {
      history.replace('/');
    } else if (isIndexer && account === coordinatorIndexer) {
      history.replace('/account');
    }
  }, [isIndexer, account]);

  const item = useMemo(() => currentStep && prompts[currentStep], [currentStep]);

  const moveToNextStep = () => {
    setLoading(false);
    setStep(registerSteps[getStepIndex(currentStep) + 1] as RegisterStep);
  };

  const onTransactionFailed = (error: any) => {
    // TODO: show alert
    console.error('Send transaction failed:', error);
    setLoading(false);
  };

  const onSyncIndexer = useCallback(async () => {
    setLoading(true);
    if (!account) {
      return dispatchToast({
        type: 'error',
        text: 'Can not find account, make sure MetaMask is connected',
      });
    }
    if (!isIndexer) {
      return dispatchToast({
        type: 'error',
        text: 'Account is not an indexer, switch to indexer account',
      });
    }

    await updateIndexer(account);
    setLoading(false);
    return history.replace('/account');
  }, [isIndexer]);

  const onApprove = async () => {
    setLoading(true);
    try {
      const tx = await indexerRequestApprove(sdk, signer, '1000000000');
      const receipt = await tx.wait(1);
      if (!receipt.status) {
        throw new Error('Send approve transaction failed');
      }
      moveToNextStep();
    } catch (e) {
      onTransactionFailed(e);
    }
  };

  const onIndexerRegister = async (
    values: TRegisterValues,
    helper: FormikHelpers<TRegisterValues>
  ) => {
    try {
      setLoading(true);
      const { name, proxyEndpoint, amount, rate } = values;
      if (Number(tokenBalance) < amount) {
        setLoading(false);
        helper.setErrors({
          [RegisterFormKey.amount]: `Account balance ${tokenBalance} is not enough for staking ${amount} SQT`,
        });
        return;
      }

      const indexerMetadata = await createIndexerMetadata(name, proxyEndpoint);
      // TODO: 1. validate `proxy endpoint`, default request `/discovery`;
      // helper.setErrors({ [RegisterFormKey.proxyEndpoint]: 'Invalid proxy endpoint' });

      const tx = await indexerRegistry(sdk, signer, amount.toString(), indexerMetadata, rate * 10);
      const receipt = await tx.wait(1);
      if (!receipt.status) {
        throw new Error('Send indexer registry transaction failed');
      }
      moveToNextStep();
    } catch (e) {
      onTransactionFailed(e);
    }
  };

  const registerActions = {
    [RegisterStep.onboarding]: () => setStep(RegisterStep.authorisation),
    [RegisterStep.authorisation]: onApprove,
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
      {currentStep && item && !isRegisterStep() && (
        // @ts-ignore
        <IntroductionView item={item} loading={loading} onClick={registerActions[currentStep]} />
      )}
      {currentStep && isRegisterStep() && (
        <IndexerRegistryView loading={loading} onSubmit={onIndexerRegister} />
      )}
    </Container>
  );
};

export default RegisterPage;
