// Copyright 2020-2022 SubQuery Pte Ltd authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useCallback, useMemo } from 'react';

import { useContractSDK } from 'containers/contractSdk';
import { useToast } from 'containers/toastContext';
import { TransactionType } from 'pages/project-details/config';
import {
  configController,
  readyIndexing,
  startIndexing,
  stopIndexing,
  unRegister,
  updateMetadata,
} from 'utils/indexerActions';
import { AccountAction, handleTransaction, ProjectAction } from 'utils/transactions';

import { useSigner } from './web3Hook';

type Callback = () => any | Promise<any> | undefined;

export const useAccountAction = () => {
  const signer = useSigner();
  const sdk = useContractSDK();
  const toastContext = useToast();

  const accountTransactions = useCallback(
    (param: string) => ({
      [AccountAction.updateMetaData]: () => updateMetadata(sdk, signer, param),
      [AccountAction.configCntroller]: () => configController(sdk, signer, param),
      [AccountAction.unregister]: () => unRegister(sdk, signer),
    }),
    [sdk, signer]
  );

  return useCallback(
    async (type: AccountAction, param: string, onProcess: Callback, onSuccess?: Callback) => {
      try {
        const sendTx = accountTransactions(param)[type];
        const tx = await sendTx();
        onProcess();
        await handleTransaction(tx, toastContext, onSuccess);
      } catch {
        onProcess();
      }
    },
    [accountTransactions]
  );
};

export const useIndexingAction = (id: string) => {
  const signer = useSigner();
  const sdk = useContractSDK();
  const toastContext = useToast();

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
        const tx = await sendTx();
        onProcess();
        await handleTransaction(tx, toastContext, onSuccess);
      } catch {
        onProcess();
      }
    },
    [indexingTransactions]
  );
};
