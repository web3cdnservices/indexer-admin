// Copyright 2020-2022 SubQuery Pte Ltd authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { ContractDeployment, ContractSDK, SdkOptions, SubqueryNetwork } from '@subql/contract-sdk';
import testnetDeployment from '@subql/contract-sdk/publish/testnet.json';

import localnetDeployment from 'contract/localnet.json';
import { useIsMetaMask, useWeb3 } from 'hooks/web3Hook';
import Logger from 'utils/logger';
import { ChainID, isSupportNetwork, Networks } from 'utils/web3';

import { createContainer } from './unstated';

const deployments: Record<SubqueryNetwork, ContractDeployment> = {
  local: localnetDeployment,
  testnet: testnetDeployment,
  mainnet: testnetDeployment,
};

function createContractOptions(network: SubqueryNetwork): SdkOptions {
  return {
    deploymentDetails: deployments[network] as ContractDeployment,
    network,
  };
}

const options = {
  [ChainID.local]: createContractOptions(Networks.local),
  [ChainID.testnet]: createContractOptions(Networks.testnet),
  [ChainID.mainnet]: createContractOptions(Networks.mainnet),
};

export type SDK = ContractSDK | undefined;

function useContractsImpl(logger: Logger): SDK {
  const [sdk, setSdk] = React.useState<ContractSDK>();
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
      ContractSDK.create(library, sdkOption)
        .then((instance) => setSdk(instance))
        .catch((e) => {
          logger.e('Failed to create ContractSDK instance', e);
          setSdk(undefined);
        });
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
