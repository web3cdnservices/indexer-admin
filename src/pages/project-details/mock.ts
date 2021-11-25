// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { TService } from './types';

export const queryServiceItem: TService = {
  name: 'Query Service',
  status: 'Healthy',
  url: 'https://api.subquery.network/sq/AcalaNetwork/karura',
  imageVersion: 'onfinality/subql-query:v0.6.0',
};

export const indexerServiceItem: TService = {
  name: 'Indexer Service',
  status: 'Healthy',
  url: 'https://api.subquery.network/sq/AcalaNetwork/karura',
  imageVersion: 'onfinality/subql-node:v0.19.1',
};

export const projectItem = {
  description:
    "Aims to deliver analytics & historical data for Sushi's incentivized pools on the MasterChef contract. Includes Kashi KMP & Exchange SLP tokens that are staked for Sushi emissions. Official Sushi Subgraph. Aims to deliver analytics & historical data for Sushi's incentivized pools on the MasterChef contract. Includes Kashi KMP & Exchange SLP tokens that are staked for Sushi emissions. Official Sushi Subgraph",
  created: '3 Months Ago',
  lastUpdated: '3 Months Ago',
  websiteUrl: 'https://acala.network/',
  sourceUrl: 'https://acala.network/', // should be a ipfs address
};
