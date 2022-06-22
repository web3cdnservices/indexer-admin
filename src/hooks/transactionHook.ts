// Copyright 2020-2022 SubQuery Pte Ltd authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useCallback, useMemo } from 'react';

import { useContractSDK } from 'containers/contractSdk';
import { useNotification } from 'containers/notificationContext';
import { AccountActionName } from 'pages/account/config';
import { ControllerAction } from 'pages/controllers/types';
import { ProjectActionName } from 'pages/project-details/config';
import { AccountAction, ProjectAction, TransactionType } from 'pages/project-details/types';
import {
  configController,
  readyIndexing,
  startIndexing,
  stopIndexing,
  unRegister,
  updateMetadata,
} from 'utils/indexerActions';
import { handleTransaction } from 'utils/transactions';

import { useSigner } from './web3Hook';

type Callback = (e?: any) => any | Promise<any> | undefined;
type AccountTxType = AccountAction | ControllerAction.configController;
const ActionNames = {
  ...AccountActionName,
  [ControllerAction.configController]: 'Update Controller',
};

export const useAccountAction = () => {
  const signer = useSigner();
  const sdk = useContractSDK();
  const notificationContext = useNotification();

  const accountTransactions = useCallback(
    (param: string) => ({
      [AccountAction.updateMetaData]: () => updateMetadata(sdk, signer, param),
      [AccountAction.unregister]: () => unRegister(sdk, signer),
      [ControllerAction.configController]: () => configController(sdk, signer, param),
    }),
    [sdk, signer]
  );

  return useCallback(
    async (type: AccountTxType, param: string, onProcess: Callback, onSuccess?: Callback) => {
      try {
        const sendTx = accountTransactions(param)[type];
        const actionName = ActionNames[type];
        const tx = await sendTx();
        onProcess();
        await handleTransaction(actionName, tx, notificationContext, onSuccess);
      } catch (e) {
        onProcess(e);
      }
    },
    [accountTransactions]
  );
};

export const useIndexingAction = (id: string) => {
  const signer = useSigner();
  const sdk = useContractSDK();
  const notificationContext = useNotification();

  const indexingTransactions = useMemo(
    () => ({
      [ProjectAction.AnnounceIndexing]: () => startIndexing(sdk, signer, id),
      [ProjectAction.AnnounceReady]: () => readyIndexing(sdk, signer, id),
      [ProjectAction.AnnounceNotIndexing]: () => stopIndexing(sdk, signer, id),
    }),
    [sdk, signer, id]
  );

  return useCallback(
    async (type: TransactionType, onProcess: Callback, onSuccess?: Callback) => {
      try {
        const sendTx = indexingTransactions[type];
        const actionName = ProjectActionName[type];
        const tx = await sendTx();
        onProcess();
        await handleTransaction(actionName, tx, notificationContext, onSuccess);
      } catch (e) {
        onProcess(e);
      }
    },
    [indexingTransactions]
  );
};
