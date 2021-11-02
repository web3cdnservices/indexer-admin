// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { ContractSDK, SdkOptions, SubqueryNetwork } from '@subql/contract-sdk';
import { createContainer } from './unstated';
import Logger from '../utils/logger';
import deploymentDetails from '../contract/localnet.json';
import { useIsMetaMask, useWeb3Provider } from '../hooks/web3Hook';

export const contractSDKOptions = {
  network: 'local' as SubqueryNetwork,
  deploymentDetails,
};

export type SDK = ContractSDK | undefined;

function useContractsImpl(logger: Logger, initialState?: SdkOptions): SDK {
  const [sdk, setSdk] = React.useState<ContractSDK | undefined>(undefined);

  const provider = useWeb3Provider();
  const isMetaMask = useIsMetaMask();

  React.useEffect(() => {
    if (!initialState || !initialState.network || !initialState.deploymentDetails) {
      throw new Error(
        'Invalid initial state, contracts provider requires network and deploymentDetails'
      );
    }

    if (provider && isMetaMask) {
      try {
        ContractSDK.create(provider, initialState).then((instance) => setSdk(instance));
      } catch (e) {
        logger.e('Failed to create ContractSDK instance', e);
        setSdk(undefined);
      }
    }
  }, [logger, initialState, provider, isMetaMask]);

  return sdk;
}

export const { useContainer: useContractSDK, Provider: ContractSDKProvider } = createContainer(
  useContractsImpl,
  {
    displayName: 'Contract SDK',
  }
);
