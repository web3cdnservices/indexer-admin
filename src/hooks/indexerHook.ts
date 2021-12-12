// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useCallback, useEffect, useState } from 'react';
import { formatUnits } from '@ethersproject/units';

import { useContractSDK } from 'containers/contractSdk';
import { useWeb3 } from 'hooks/web3Hook';
import { emptyControllerAccount } from 'utils/indexerActions';

type Account = string | null | undefined;

export const useIsIndexer = (address?: Account): boolean | undefined => {
  const { account: currentAccount } = useWeb3();
  const account = address ?? currentAccount;
  const [isIndexer, setIsIndexer] = useState<boolean | undefined>(undefined);
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

const useCheckStateChanged = (caller?: () => Promise<boolean | string | number> | undefined) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | undefined>(undefined);

  const request = useCallback(
    (targetValue: boolean | string | number, callBack: () => void): Promise<void> =>
      new Promise((_, reject) => {
        if (!caller) {
          reject(new Error('Contract SDK not init'));
          return;
        }

        setLoading(true);
        const id = setInterval(() => {
          caller()
            ?.then((value) => {
              if (value === targetValue) {
                setError(undefined);
                setLoading(false);
                callBack();
                clearInterval(id);
              }
            })
            .catch((e) => setError(e));
        }, 2000);
        setTimeout(() => {
          if (!loading) return;
          setLoading(false);
          clearInterval(id);
          reject(new Error('Check state request time out'));
        }, 100000);
      }),
    [caller]
  );

  return { request, loading, error };
};

export const useIsControllerChanged = (indexer: Account) => {
  const sdk = useContractSDK();
  return useCheckStateChanged(() => sdk?.indexerRegistry.indexerToController(indexer ?? ''));
};

export const useIsIndexerChanged = () => {
  const { account } = useWeb3();
  const sdk = useContractSDK();
  return useCheckStateChanged(() => sdk?.indexerRegistry.isIndexer(account ?? ''));
};

export const useIsIndexingStatusChanged = (id: string) => {
  const { account } = useWeb3();
  const sdk = useContractSDK();
  return useCheckStateChanged(() =>
    sdk?.queryRegistry.deploymentStatusByIndexer(id, account ?? '').then((item) => item.status)
  );
};

export const useIsApproveChanged = () => {
  const { account } = useWeb3();
  const sdk = useContractSDK();
  return useCheckStateChanged(() => {
    if (!sdk || !account) return undefined;
    return sdk.sqToken.allowance(account, sdk?.staking.address).then((amount) => !!amount);
  });
};

export const useController = (account: Account, refresh?: number) => {
  const [controller, setController] = useState('');
  const sdk = useContractSDK();

  useEffect(() => {
    sdk?.indexerRegistry
      .indexerToController(account ?? '')
      .then((controller) => {
        setController(controller === emptyControllerAccount ? '' : controller);
      })
      .catch(() => setController(''));
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

export const useBalance = (account: Account) => {
  const [balance, setBalance] = useState('0.00');
  const sdk = useContractSDK();

  useEffect(() => {
    account &&
      sdk?.sqToken.balanceOf(account).then((balance) => {
        setBalance(Number(formatUnits(balance, 18)).toFixed(2));
      });
  }, [account]);

  return balance;
};
