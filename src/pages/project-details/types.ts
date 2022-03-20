// Copyright 2020-2022 SubQuery Pte Ltd authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { IndexingStatus } from '../projects/constant';

export type ProjectServiceMetadata = {
  id: string;
  status: IndexingStatus;
  networkEndpoint: string;
  nodeEndpoint: string;
  queryEndpoint: string;
};

export type TService = {
  status: string;
  url: string;
  imageVersion: string;
};

export type TQueryMetadata = {
  lastProcessedHeight: number;
  lastProcessedTimestamp: number;
  targetHeight: number;
  chain: string;
  specName: string;
  genesisHash: string;
  indexerHealthy?: boolean;
  indexerNodeVersion: string;
  queryNodeVersion: string;
};
