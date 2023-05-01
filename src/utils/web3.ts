// Copyright 2020-2022 SubQuery Pte Ltd authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { networks } from '@subql/contract-sdk';

export const SUPPORTED_NETWORK = (window.env.network ?? 'testnet') as keyof typeof networks;

export const PRODUCTION_NETWORK = 'kepler';

export enum ChainID {
  testnet = '0x13881',
  kepler = '0x89',
  mainnet = '0x89',
}

export type SubqueryNetwork = 'mainnet' | 'kepler' | 'testnet';

export const ChainIDs = [ChainID.testnet, ChainID.kepler];

export const NetworkToChainID: Record<SubqueryNetwork, ChainID> = {
  testnet: ChainID.testnet,
  kepler: ChainID.kepler,
  mainnet: ChainID.mainnet,
};

export const isSupportNetwork = (chaiId: ChainID) => ChainIDs.includes(chaiId);

export const RPC_URLS: Record<number, string> = {
  80001: 'https://polygon-mumbai.infura.io/v3/4458cf4d1689497b9a38b1d6bbf05e78',
  137: 'https://polygon-rpc.com/',
};

export const NETWORK_CONFIGS = {
  [ChainID.testnet]: networks.testnet,
  [ChainID.kepler]: networks.kepler,
};

export function hexToInt(hex: string) {
  return parseInt(hex, 16);
}

export const SUPPORTED_NETWORK_PROJECTS_EXPLORER =
  window.env.network === PRODUCTION_NETWORK
    ? 'https://kepler.subquery.network/'
    : 'https://kepler.thechaindata.com/';

export const FLEX_PLAN_FEATURE = window.env.network !== PRODUCTION_NETWORK;
