// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { SubqueryNetwork } from '@subql/contract-sdk';

export enum ChainID {
  local = 1281,
  testnet = 1280,
  mainnet = 1285,
}

export const ChainIDs = [ChainID.local, ChainID.testnet, ChainID.mainnet];

export const NetworkToChainID: Record<SubqueryNetwork, ChainID> = {
  local: ChainID.local,
  testnet: ChainID.testnet,
  mainnet: ChainID.mainnet,
};

export const isSupportNetwork = (chaiId?: number) => ChainIDs.includes(chaiId ?? 0);

export const RPC_URLS: Record<number, string> = {
  1280: 'https://node-6899466758367993856.lh.onfinality.io/rpc?apikey=4de1316d-df00-439a-a51b-2b59346b2789',
  1281: 'http://127.0.0.1:9933',
  1285: 'https://moonriver.api.onfinality.io/public',
  1287: 'https://moonbeam-alpha.api.onfinality.io/public',
};

export const networks: Record<number, SubqueryNetwork> = {
  1281: 'local',
  1285: 'mainnet',
  1280: 'testnet',
};

export const chainNames: Record<number, string> = {
  1280: 'SQN Testnet',
  1281: 'Moonbeam Local',
  1285: 'Moonriver',
  1287: 'Moonbeam Dev',
};
