// Copyright 2020-2022 SubQuery Pte Ltd authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { intToHex } from 'ethereumjs-util';

export enum ChainID {
  testnet = 595,
  moonbase = 1287,
  mainnet = 1285,
}

export enum Networks {
  moonbase = 'moonbase',
  testnet = 'testnet',
  mainnet = 'mainnet',
}

export type SubqueryNetwork = 'mainnet' | 'testnet' | 'moonbase';

export const ChainIDs = [ChainID.moonbase, ChainID.testnet, ChainID.mainnet];

export const NetworkToChainID: Record<SubqueryNetwork, ChainID> = {
  moonbase: ChainID.moonbase,
  testnet: ChainID.testnet,
  mainnet: ChainID.mainnet,
};

export const isSupportNetwork = (chaiId?: number) => ChainIDs.includes(chaiId ?? 0);

export const RPC_URLS: Record<number, string> = {
  595: 'https://tc7-eth.aca-dev.network',
  1285: 'https://moonriver.api.onfinality.io/public',
  1287: 'https://moonbeam-alpha.api.onfinality.io/public',
  31337: 'http://127.0.0.1:8545',
};

export const networks: Record<number, SubqueryNetwork> = {
  595: Networks.testnet,
  1287: Networks.moonbase,
  1285: Networks.mainnet,
};

export const chainNames: Record<number, string> = {
  595: 'Acala Testnet',
  1285: 'Moonriver',
  1287: 'Moonbeam Dev',
  31337: 'Hardhat Local',
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
    blockExplorerUrls: ['https://blockscout.mandala.acala.network/'],
  },
  [ChainID.moonbase]: {
    chainId: intToHex(1287),
    chainName: 'Moonbase Alpha',
    nativeCurrency: {
      name: 'DEV',
      symbol: 'DEV',
      decimals: 18,
    },
    rpcUrls: [RPC_URLS[1287]],
    blockExplorerUrls: ['https://moonbase.moonscan.io/'],
  },
};
