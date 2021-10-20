// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { ContractSDK, SdkOptions, SubqueryNetwork } from '@subql/contract-sdk';
import { createContainer } from './unstated';
import Logger from './logger';
import { useWeb3Provider } from './web3';
import deploymentDetails from '../contract/localnet.json';

export const contractSDKOptions = {
  network: 'local' as SubqueryNetwork,
  deploymentDetails,
};

// TODO: refactor
function useContractsImpl(logger: Logger, initialState?: SdkOptions): ContractSDK | undefined {
  const [sdk, setSdk] = React.useState<ContractSDK | undefined>(undefined);

  const provider = useWeb3Provider();

  const initSdk = React.useCallback(async () => {
    if (!initialState || !initialState.network || !initialState.deploymentDetails) {
      throw new Error(
        'Invalid initial state, contracts provider requires network and deploymentDetails'
      );
    }

    try {
      const instance = provider ? await ContractSDK.create(provider, initialState) : undefined;
      setSdk(instance);
    } catch (e) {
      logger.e('Failed to create ContractSDK instance', e);
      setSdk(undefined);
      throw e;
    }
  }, [logger, initialState]);

  React.useEffect(() => {
    initSdk();
  }, [initSdk]);

  return sdk;
}

export const { useContainer: useContractSDK, Provider: ContractSDKProvider } = createContainer(
  useContractsImpl,
  {
    displayName: 'Contract SDK',
  }
);
