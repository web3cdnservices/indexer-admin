// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { ContractSDK, SdkOptions, SubqueryNetwork } from '@subql/contract-sdk';
import { createContainer } from './unstated';
import Logger from '../utils/logger';
import localnetDeployment from '../contract/localnet.json';
import testnetDeployment from '../contract/testnet.json';
import { useIsMetaMask, useWeb3 } from '../hooks/web3Hook';
import { ChainID, isSupportNetwork } from './web3';

const deployments = {
  local: localnetDeployment,
  testnet: testnetDeployment,
  mainnet: testnetDeployment,
};

function createContractOptions(network: SubqueryNetwork): SdkOptions {
  return {
    deploymentDetails: deployments[network],
    network,
  };
}

const options = {
  [ChainID.local]: createContractOptions('local'),
  [ChainID.test]: createContractOptions('testnet'),
  [ChainID.main]: createContractOptions('mainnet'),
};

export type SDK = ContractSDK | undefined;

function useContractsImpl(logger: Logger): SDK {
  const [sdk, setSdk] = React.useState<ContractSDK | undefined>(undefined);
  const { library, chainId } = useWeb3();
  const isMetaMask = useIsMetaMask();

  React.useEffect(() => {
    if (!chainId || !isSupportNetwork(chainId)) return;

    const sdkOption = options[chainId as ChainID];
    if (!sdkOption || !sdkOption.network || !sdkOption.deploymentDetails) {
      throw new Error(
        'Invalid sdk options, contracts provider requires network and deploymentDetails'
      );
    }

    if (library && isMetaMask) {
      try {
        ContractSDK.create(library, sdkOption).then((instance) => setSdk(instance));
      } catch (e) {
        logger.e('Failed to create ContractSDK instance', e);
        setSdk(undefined);
      }
    }
  }, [logger, library, chainId, isMetaMask]);

  return sdk;
}

export const { useContainer: useContractSDK, Provider: ContractSDKProvider } = createContainer(
  useContractsImpl,
  {
    displayName: 'Contract SDK',
  }
);
