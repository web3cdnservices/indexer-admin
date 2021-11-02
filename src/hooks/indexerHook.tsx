// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useEffect, useState } from 'react';
import { useContractSDK } from '../containers/contractSdk';

type Account = string | null | undefined;

export const useIsIndexer = (account: Account) => {
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
