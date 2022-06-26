// Copyright 2020-2022 SubQuery Pte Ltd authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useEffect, useMemo, useState } from 'react';
import { useHistory } from 'react-router';
import { useMutation } from '@apollo/client';
import { isUndefined } from 'lodash';

import AccountCard from 'components/accountCard';
import ModalView from 'components/modalView';
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
import { MetadataFormKey } from 'types/schemas';
import { balanceSufficient } from 'utils/account';
import { createIndexerMetadata } from 'utils/ipfs';
import { REMOVE_ACCOUNTS } from 'utils/queries';

import {
  AccountActionName,
  createButonItem,
  createUnregisterSteps,
  createUpdateMetadataSteps,
} from './config';
import prompts, { notifications } from './prompts';
import { Container } from './styles';
import { AccountButtonItem } from './types';

const Account = () => {
  const [visible, setVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [actionType, setActionType] = useState<AccountAction>();

  const { account } = useWeb3();
  const isIndexer = useIsIndexer();
  const { indexer } = useCoordinatorIndexer();
  const { metadata, fetchMetadata } = useIndexerMetadata();
  const accountAction = useAccountAction();
  const isMetaMask = useIsMetaMask();
  const isController = useIsController(account);
  const { controller } = useController();
  const controllerBalance = useBalance(controller);
  const indexerBalance = useBalance(account);
  const { dispatchNotification } = useNotification();
  const { setPageLoading } = useLoading();
  const history = useHistory();

  const [removeAccounts] = useMutation(REMOVE_ACCOUNTS);

  prompts.controller.desc = `Balance: ${controllerBalance} ACA`;
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

  const onButtonPress = (type?: AccountAction) => {
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

  const controllerButtons = [
    {
      title: 'Manange Controllers',
      onClick: () => history.push('/controller-management'),
    } as AccountButtonItem,
  ];

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

  const steps = useMemo(() => ({ ...unregisterStep, ...updateMetadataStep }), [metadata]);

  return (
    <Container>
      {isMetaMask && isIndexer && (
        <AccountCard
          key={account}
          title={indexerItem.title}
          name={indexerName}
          buttons={indexerButtons}
          account={account ?? ''}
          desc={`Balance: ${indexerBalance} ACA`}
        />
      )}
      {(isIndexer || isController) && (
        <AccountCard
          key={account}
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

export default Account;
