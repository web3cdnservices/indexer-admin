// Copyright 2020-2022 SubQuery Pte Ltd authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { bufferToHex, privateToAddress, toBuffer } from 'ethereumjs-util';

import AccountCard from 'components/accountCard';
import ModalView from 'components/modalView';
import { useContractSDK } from 'containers/contractSdk';
import { useToast } from 'containers/toastContext';
import { useBalance, useController, useIsController, useIsIndexer } from 'hooks/indexerHook';
import { useIsMetaMask, useSigner, useWeb3 } from 'hooks/web3Hook';
import { ControllerFormKey } from 'types/schemas';
import { configController, unRegister } from 'utils/indexerActions';
import { REMOVE_ACCOUNTS, UPDAET_CONTROLLER } from 'utils/queries';
import { ActionType, handleTransaction } from 'utils/transactions';
import { validatePrivateKey } from 'utils/validateService';

import { createControllerSteps, createUnregisterSteps, modalTitles } from './config';
import prompts from './prompts';
import { Container } from './styles';

const Registry = () => {
  const [visible, setVisible] = useState(false);
  const [timestamp, setTimestamp] = useState(Date.now());
  const [currentStep, setCurrentStep] = useState(0);
  const [inputController, setController] = useState('');
  const [actionType, setActionType] = useState<ActionType>();

  const { account } = useWeb3();
  const signer = useSigner();
  const sdk = useContractSDK();
  const isMetaMask = useIsMetaMask();
  const isIndexer = useIsIndexer();
  const isController = useIsController(account);
  const controller = useController(timestamp);
  const controllerBalance = useBalance(controller);
  const indexerBalance = useBalance(account);
  const toastContext = useToast();
  const [updateController] = useMutation(UPDAET_CONTROLLER);
  const [removeAccounts] = useMutation(REMOVE_ACCOUNTS);

  prompts.controller.desc = `Balance ${controllerBalance} DEV`;
  const controllerItem = !controller ? prompts.emptyController : prompts.controller;
  const indexerItem = prompts.indexer;

  const onModalShow = (type: ActionType) => {
    setActionType(type);
    setVisible(true);
  };

  const onModalClose = (error?: unknown) => {
    console.error('Transaction error:', error);
    setVisible(false);
    setCurrentStep(0);
  };

  const controllerStepsConfig = createControllerSteps(
    async (values, formHelper) => {
      formHelper.setStatus({ loading: true });
      const privateKey = values[ControllerFormKey.privateKey];
      const error = validatePrivateKey(privateKey);
      if (error) {
        formHelper.setStatus({ loading: false });
        formHelper.setErrors({ [ControllerFormKey.privateKey]: error });
        return;
      }

      const controllerAddress = bufferToHex(privateToAddress(toBuffer(privateKey)));
      const isExist = await sdk?.indexerRegistry.isController(controllerAddress);
      if (isExist) {
        formHelper.setStatus({ loading: false });
        formHelper.setErrors({
          [ControllerFormKey.privateKey]: 'Controller already been used',
        });
        return;
      }

      if (controllerAddress === account) {
        formHelper.setStatus({ loading: false });
        formHelper.setErrors({
          [ControllerFormKey.privateKey]: 'Can not use indexer account as controller account',
        });
        return;
      }

      setController(controllerAddress);
      try {
        await updateController({ variables: { controller: privateKey } });
        setCurrentStep(1);
      } catch (e) {
        onModalClose(e);
      }
      formHelper.setStatus({ loading: false });
    },
    async () => {
      try {
        const tx = await configController(sdk, signer, inputController);
        onModalClose();
        await handleTransaction(tx, toastContext, () => setTimestamp(Date.now()));
      } catch (e) {
        onModalClose();
      }
    }
  );

  const unregisterStepConfig = createUnregisterSteps(async () => {
    try {
      const tx = await unRegister(sdk, signer);
      onModalClose();
      await handleTransaction(tx, toastContext, () => removeAccounts());
    } catch (e) {
      onModalClose();
    }
  });

  const steps = { ...controllerStepsConfig, ...unregisterStepConfig };

  return (
    <Container>
      {isMetaMask && isIndexer && (
        <AccountCard
          title={indexerItem.title}
          name={indexerItem.name}
          buttonTitle={indexerItem.buttonTitle}
          type={ActionType.unregister}
          account={account ?? ''}
          status="active"
          desc={`Balance: ${indexerBalance} DEV`}
          onClick={onModalShow}
        />
      )}
      {(isIndexer || isController) && (
        <AccountCard
          title={controllerItem.title}
          name={controllerItem.name}
          type={ActionType.configCntroller}
          account={controller}
          buttonTitle={isIndexer ? controllerItem.buttonTitle : ''}
          desc={controllerItem?.desc}
          onClick={onModalShow}
        />
      )}
      {actionType && (
        <ModalView
          visible={visible}
          // @ts-ignore
          title={modalTitles[actionType]}
          onClose={onModalClose}
          // @ts-ignore
          steps={steps[actionType]}
          currentStep={currentStep}
          type={actionType}
        />
      )}
    </Container>
  );
};

export default Registry;
