// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { ContractSDK, SdkOptions, SubqueryNetwork } from '@subql/contract-sdk';
import { createContainer } from './unstated';
import Logger from '../utils/logger';
import localnetDeployment from '../contract/localnet.json';
import testnetDeployment from '../contract/testnet.json';
import { useIsMetaMask, useWeb3Provider } from '../hooks/web3Hook';

const network: SubqueryNetwork = 'testnet';
const deploymentDetails = network === 'testnet' ? testnetDeployment : localnetDeployment;

export const contractSDKOptions = {
  network,
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
