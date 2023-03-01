// Copyright 2020-2022 SubQuery Pte Ltd authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useCallback, useEffect, useMemo, useState } from 'react';

import { useContractSDK } from 'containers/contractSdk';

import { useWeb3 } from './web3Hook';

export const useTokenSymbol = () => {
  const { chainId } = useWeb3();
  const tokenSymbol = useMemo(() => {
    if (chainId === 80001) {
      return 'MATIC';
    }
    if (chainId === 173) {
      return 'DEV';
    }

    return 'DEV';
  }, [chainId]);

  return tokenSymbol;
};

export type IndexerEra = {
  currentEra: string;
  lastClaimedEra: string;
  lastSettledEra: string;
};

export const useIndexerEra = () => {
  const { account } = useWeb3();
  const sdk = useContractSDK();

  const [indexerEra, setIndexerEra] = useState<IndexerEra>();

  const updateEra = useCallback(async () => {
    if (!sdk || !account) return;

    const lastClaimedEra = (await sdk.rewardsDistributor.getRewardInfo(account)).lastClaimEra;
    const [currentEra, lastSettledEra] = await Promise.all([
      sdk.eraManager.eraNumber(),
      sdk.rewardsStaking.getLastSettledEra(account),
    ]);

    setIndexerEra({
      currentEra: currentEra.toString(),
      lastClaimedEra: lastClaimedEra.toString(),
      lastSettledEra: lastSettledEra.toString(),
    });
  }, [sdk, account]);

  useEffect(() => {
    updateEra();
  }, [updateEra]);

  return indexerEra;
};
