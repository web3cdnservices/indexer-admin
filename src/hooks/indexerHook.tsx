// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useEffect, useState } from 'react';
import { useContractSDK } from '../containers/contractSdk';
import { useWeb3 } from './web3Hook';

type Account = string | null | undefined;

export const useIsIndexer = (address?: Account) => {
  const { account: currentAccount } = useWeb3();
  const account = address ?? currentAccount;
  const [isIndexer, setIsIndexer] = useState(false);
  const sdk = useContractSDK();

  useEffect(() => {
    sdk?.indexerRegistry
      .isIndexer(account ?? '')
      .then((isIndexer) => setIsIndexer(isIndexer))
      .catch(() => setIsIndexer(false));
  }, [account, sdk]);

  return isIndexer;
};

export const useIsController = (account: Account) => {
  const [isController, setIsController] = useState(false);
  const sdk = useContractSDK();

  useEffect(() => {
    sdk?.indexerRegistry
      .isController(account ?? '')
      .then((isController) => setIsController(isController))
      .catch(() => setIsController(false));
  }, [account, sdk]);

  return isController;
};

export const useController = (account: Account) => {
  const [controller, setController] = useState('');
  const sdk = useContractSDK();

  useEffect(() => {
    sdk?.indexerRegistry
      .indexerToController(account ?? '')
      .then((controller) => {
        setController(controller);
      })
      .catch(() => setController(''));
  }, [account, sdk]);

  return controller;
};

export const useControllerToIndexer = (account: Account) => {
  const [indexer, setIndexer] = useState('');
  const sdk = useContractSDK();

  useEffect(() => {
    sdk?.indexerRegistry
      .controllerToIndexer(account ?? '')
      .then((indexer) => {
        setIndexer(indexer);
      })
      .catch(() => setIndexer(''));
  }, [account, sdk]);

  return indexer;
};

export const useAccountType = (account: Account) => {
  const [accountType, setAccountType] = useState<string>('');
  const isIndexer = useIsIndexer(account);
  const isController = useIsController(account);

  useEffect(() => {
    // eslint-disable-next-line no-nested-ternary
    setAccountType(isIndexer ? 'Indexer' : isController ? 'Controller' : '');
  }, [account, isIndexer, isController]);

  return accountType;
};

// events hook
export const useIndexerEvent = () => {
  const [event, setEvent] = useState<string>('');
  const sdk = useContractSDK();

  useEffect(() => {
    sdk?.queryRegistry.on('StartIndexing', (deploymentId) =>
      setEvent(`Indexer starts indexing the project ${deploymentId}`)
    );
    sdk?.queryRegistry.on('StopIndexing', (deploymentId) =>
      setEvent(`Indexer stop indexing the project ${deploymentId}`)
    );
    sdk?.queryRegistry.on('CreateQuery', (a, b, deploymentId) =>
      setEvent(`New Query project created: ${deploymentId}`)
    );
  }, [sdk]);

  return event;
};
