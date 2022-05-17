// Copyright 2020-2022 SubQuery Pte Ltd authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useEffect, useMemo, useState } from 'react';
import { useHistory } from 'react-router';
import { useMutation } from '@apollo/client';
import { isUndefined } from 'lodash';

import AccountCard from 'components/accountCard';
import ModalView from 'components/modalView';
import { useContractSDK } from 'containers/contractSdk';
import { useCoordinatorIndexer } from 'containers/coordinatorIndexer';
import { useLoading } from 'containers/loadingContext';
import { useNotification } from 'containers/notificationContext';
import {
  useBalance,
  useController,
  useIndexerMetadata,
  useIsController,
  useIsIndexer,
} from 'hooks/indexerHook';
import { useAccountAction } from 'hooks/transactionHook';
import { useIsMetaMask, useWeb3 } from 'hooks/web3Hook';
import { AccountAction } from 'pages/project-details/types';
import { ControllerFormKey, MetadataFormKey } from 'types/schemas';
import { balanceSufficient } from 'utils/account';
import { createIndexerMetadata } from 'utils/ipfs';
import { REMOVE_ACCOUNTS, UPDAET_CONTROLLER } from 'utils/queries';
import { privateToAddress, validateController } from 'utils/validateService';

import {
  AccountActionName,
  configControllerFailed,
  configControllerSucceed,
  createButonItem,
  createControllerSteps,
  createUnregisterSteps,
  createUpdateMetadataSteps,
} from './config';
import prompts, { notifications } from './prompts';
import { Container } from './styles';

const Registry = () => {
  const [visible, setVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [inputController, setController] = useState('');
  const [actionType, setActionType] = useState<AccountAction>();

  const { account } = useWeb3();
  const sdk = useContractSDK();
  const isIndexer = useIsIndexer();
  const { indexer } = useCoordinatorIndexer();
  const { metadata, fetchMetadata } = useIndexerMetadata();
  const accountAction = useAccountAction();
  const isMetaMask = useIsMetaMask();
  const isController = useIsController(account);
  const { controller, getController } = useController();
  const controllerBalance = useBalance(controller);
  const indexerBalance = useBalance(account);
  const { dispatchNotification } = useNotification();
  const [updateController] = useMutation(UPDAET_CONTROLLER);
  const [removeAccounts] = useMutation(REMOVE_ACCOUNTS);
  const { setPageLoading } = useLoading();
  const history = useHistory();

  prompts.controller.desc = `Balance: ${controllerBalance} DEV`;
  const controllerItem = !controller ? prompts.emptyController : prompts.controller;
  const indexerItem = prompts.indexer;

  useEffect(() => {
    setPageLoading(isUndefined(account) || isUndefined(indexer));
  }, [account, indexer]);

  useEffect(() => {
    if (controllerBalance && !balanceSufficient(controllerBalance)) {
      dispatchNotification(notifications.controller);
    }
  }, [controllerBalance]);

  const onButtonPress = (type: AccountAction) => {
    setActionType(type);
    setVisible(true);
  };

  const onModalClose = () => {
    setVisible(false);
    setTimeout(() => setCurrentStep(0), 1000);
  };

  const indexerName = useMemo(() => metadata?.name ?? ' ', [metadata]);

  const indexerButtons = [
    createButonItem(AccountAction.updateMetaData, onButtonPress),
    createButonItem(AccountAction.unregister, onButtonPress),
  ];

  const controllerButtons = [createButonItem(AccountAction.configCntroller, onButtonPress)];

  const controllerSteps = createControllerSteps(
    async (values, formHelper) => {
      formHelper.setStatus({ loading: true });
      const privateKey = values[ControllerFormKey.privateKey];
      const controllerAddress = privateToAddress(privateKey);
      const indexerController = await sdk?.indexerRegistry.indexerToController(account ?? '');
      const isExist =
        !!controllerAddress && (await sdk?.indexerRegistry.isController(controllerAddress));

      const error = validateController(privateKey, isExist, account ?? '', indexerController);
      if (error) {
        formHelper.setStatus({ loading: false });
        formHelper.setErrors({ [ControllerFormKey.privateKey]: error });
        return;
      }

      setController(controllerAddress);

      try {
        await updateController({ variables: { controller: privateKey } });
        dispatchNotification(configControllerSucceed(controllerAddress));
        setCurrentStep(1);
      } catch {
        onModalClose();
        dispatchNotification(configControllerFailed(controllerAddress));
      }
      formHelper.setStatus({ loading: false });
    },
    () => accountAction(AccountAction.configCntroller, inputController, onModalClose, getController)
  );

  const updateMetadataStep = useMemo(
    () =>
      createUpdateMetadataSteps(async (values, formHelper) => {
        formHelper.setStatus({ loading: true });
        const name = values[MetadataFormKey.name];
        const proxyEndpoint = values[MetadataFormKey.proxyEndpoint];
        const metadata = await createIndexerMetadata(name, proxyEndpoint);
        await accountAction(AccountAction.updateMetaData, metadata, onModalClose, fetchMetadata);
      }, metadata),
    [metadata]
  );

  const unregisterCompleted = async () => {
    await removeAccounts();
    history.replace('/register');
  };

  const unregisterStep = createUnregisterSteps(() =>
    accountAction(AccountAction.unregister, '', onModalClose, unregisterCompleted)
  );

  const steps = useMemo(
    () => ({ ...controllerSteps, ...unregisterStep, ...updateMetadataStep }),
    [metadata, inputController]
  );

  return (
    <Container>
      {isMetaMask && isIndexer && (
        <AccountCard
          title={indexerItem.title}
          name={indexerName}
          buttons={indexerButtons}
          account={account ?? ''}
          desc={`Balance: ${indexerBalance} DEV`}
        />
      )}
      {(isIndexer || isController) && (
        <AccountCard
          title={controllerItem.title}
          name={controllerItem.name}
          account={controller}
          buttons={controllerButtons}
          desc={controllerItem?.desc}
        />
      )}
      {actionType && (
        <ModalView
          visible={visible}
          title={AccountActionName[actionType]}
          onClose={onModalClose}
          steps={steps[actionType]}
          currentStep={currentStep}
          type={actionType}
        />
      )}
    </Container>
  );
};

export default Registry;
