// Copyright 2020-2022 SubQuery Pte Ltd authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { SubqueryNetwork } from '@subql/contract-sdk';
import { intToHex } from 'ethereumjs-util';

export enum ChainID {
  local = 1281,
  testnet = 595,
  mainnet = 1285,
}

export enum Networks {
  local = 'local',
  testnet = 'testnet',
  mainnet = 'mainnet',
}

export const ChainIDs = [ChainID.local, ChainID.testnet, ChainID.mainnet];

export const NetworkToChainID: Record<SubqueryNetwork, ChainID> = {
  local: ChainID.local,
  testnet: ChainID.testnet,
  mainnet: ChainID.mainnet,
};

export const isSupportNetwork = (chaiId?: number) => ChainIDs.includes(chaiId ?? 0);

export const RPC_URLS: Record<number, string> = {
  595: 'https://tc7-eth.aca-dev.network',
  1281: 'http://127.0.0.1:9933',
  1285: 'https://moonriver.api.onfinality.io/public',
  1287: 'https://moonbeam-alpha.api.onfinality.io/public',
};

export const networks: Record<number, SubqueryNetwork> = {
  1281: Networks.local,
  595: Networks.testnet,
  1285: Networks.mainnet,
};

export const chainNames: Record<number, string> = {
  595: 'SQN Testnet',
  1281: 'Moonbeam Local',
  1285: 'Moonriver',
  1287: 'Moonbeam Dev',
};

export const NETWORK_CONFIGS = {
  [ChainID.testnet]: {
    chainId: intToHex(ChainID.testnet),
    chainName: 'Acala Testnet',
    nativeCurrency: {
      name: 'Acala',
      symbol: 'Acala',
      decimals: 18,
    },
    rpcUrls: [RPC_URLS[ChainID.testnet]],
    blockExplorerUrls: null,
  },
  1287: {
    chainId: intToHex(1287),
    chainName: 'Moonbase Alpha',
    nativeCurrency: {
      name: 'ACA',
      symbol: 'ACA',
      decimals: 18,
    },
    rpcUrls: [RPC_URLS[1287]],
    blockExplorerUrls: ['https://moonbase-blockscout.testnet.moonbeam.network/'],
  },
};
