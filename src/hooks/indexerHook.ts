// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useCallback, useEffect, useState } from 'react';
import { formatUnits } from '@ethersproject/units';

import { useContractSDK } from 'containers/contractSdk';
import { useWeb3 } from 'hooks/web3Hook';
import { HookDependency } from 'types/types';
import { emptyControllerAccount } from 'utils/indexerActions';

export type Account = string | null | undefined;

export const useIsIndexer = (address?: Account): boolean | undefined => {
  const { account: currentAccount } = useWeb3();
  const account = address ?? currentAccount;
  const [isIndexer, setIsIndexer] = useState<boolean>();
  const sdk = useContractSDK();

  useEffect(() => {
    if (!sdk) {
      setIsIndexer(false);
      return;
    }

    sdk.indexerRegistry
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

export const useController = (refresh?: number) => {
  const [controller, setController] = useState<string>();
  const { account } = useWeb3();
  const sdk = useContractSDK();

  useEffect(() => {
    sdk?.indexerRegistry
      .indexerToController(account ?? '')
      .then((controller) => setController(controller === emptyControllerAccount ? '' : controller))
      .catch(() => setController(undefined));
  }, [account, sdk, refresh]);

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

export const useTokenBalance = (account: Account, deps?: HookDependency) => {
  const [balance, setBalance] = useState('0.00');
  const sdk = useContractSDK();

  useEffect(() => {
    account &&
      sdk?.sqToken.balanceOf(account).then((value) => {
        setBalance(Number(formatUnits(value, 18)).toFixed(2));
      });
  }, [account, sdk, deps]);

  return balance;
};

export const useBalance = (account: Account) => {
  const [balance, setBalance] = useState('0.00');
  const { library } = useWeb3();

  const getBalance = useCallback(async () => {
    if (!account || !library) return;
    try {
      const value = await library?.getBalance(account);
      const fixedValue = Number(formatUnits(value, 18)).toFixed(4);
      setBalance(fixedValue);
    } catch (e) {
      console.error('Get balance failed for:', account);
    }
  }, [account]);

  useEffect(() => {
    getBalance();
  }, [getBalance]);

  return balance;
};
