// Copyright 2020-2022 SubQuery Pte Ltd authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useCallback, useEffect, useMemo, useState } from 'react';
import { formatUnits } from '@ethersproject/units';

import { useContractSDK } from 'containers/contractSdk';
import { useCoordinatorIndexer } from 'containers/coordinatorIndexer';
import { useWeb3 } from 'hooks/web3Hook';
import { Account, IndexerMetadata } from 'pages/account/types';
import { HookDependency } from 'types/types';
import { emptyControllerAccount } from 'utils/indexerActions';
import { bytes32ToCid, cat } from 'utils/ipfs';

// indexer save inside coordinator service
export const useIsCoordinatorIndexer = (): boolean => {
  const { indexer } = useCoordinatorIndexer();
  const { account } = useWeb3();

  return useMemo(() => !!account && !!indexer && account === indexer, [account, indexer]);
};

export const useIsRegistedIndexer = (): boolean | undefined => {
  const { account } = useWeb3();
  const [isIndexer, setIsIndexer] = useState<boolean>();
  const sdk = useContractSDK();

  const getIsIndexer = useCallback(async () => {
    if (!account || !sdk) return;
    try {
      const status = await sdk?.indexerRegistry.isIndexer(account);
      setIsIndexer(status);
    } catch {
      setIsIndexer(false);
    }
  }, [account, sdk]);

  useEffect(() => {
    getIsIndexer();
  }, [getIsIndexer]);

  return isIndexer;
};

export const useIsIndexer = (): boolean | undefined => {
  const isCoordinatorIndexer = useIsCoordinatorIndexer();
  const isRegisteredIndexer = useIsRegistedIndexer();

  return useMemo(
    () => isCoordinatorIndexer && isRegisteredIndexer,
    [isCoordinatorIndexer, isRegisteredIndexer]
  );
};

// TODO: refactor these hooks
// 1. using `useMemo` | `useCallback` to replace custome useState
// 2. using try catch | async await other than promise
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

export const useController = () => {
  const [controller, setController] = useState<string>();
  const { account } = useWeb3();
  const sdk = useContractSDK();

  const getController = useCallback(async () => {
    try {
      const controller = await sdk?.indexerRegistry.indexerToController(account ?? '');
      setController(controller === emptyControllerAccount ? '' : controller);
    } catch {
      setController(undefined);
    }
  }, [account, sdk]);

  useEffect(() => {
    getController();
  }, [getController]);

  return { controller, getController };
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
  const [tokenBalance, setBalance] = useState('0.00');
  const sdk = useContractSDK();

  const getTokenBalance = useCallback(async () => {
    if (!sdk || !account) return;
    try {
      const value = await sdk.sqToken.balanceOf(account);
      const balance = Number(formatUnits(value, 18)).toFixed(2);
      setBalance(balance);
    } catch (e) {
      console.error('Get token balance failed for:', account);
    }
  }, [account, sdk]);

  useEffect(() => {
    getTokenBalance();
  }, [getTokenBalance, deps]);

  return { tokenBalance, getTokenBalance };
};

export const useBalance = (account: Account) => {
  const [balance, setBalance] = useState<string>();
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

export const useIndexerMetadata = () => {
  const { account } = useWeb3();
  const sdk = useContractSDK();
  const [metadata, setMetadata] = useState<IndexerMetadata>();

  const fetchMetadata = useCallback(async () => {
    if (!account) return;
    try {
      const metadataHash = await sdk?.indexerRegistry.metadataByIndexer(account);
      if (!metadataHash) return;

      const metadata = await cat(bytes32ToCid(metadataHash));
      setMetadata(metadata);
    } catch {
      console.error('Failed to get indexer metadata');
    }
  }, [sdk, account]);

  useEffect(() => {
    fetchMetadata();
  }, [fetchMetadata]);

  return { metadata, fetchMetadata };
};
