// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { IndexingStatus } from '../projects/constant';

export type TProject = {
  id: string;
  indexerEndpoint: string;
  queryEndpoint: string;
  status: IndexingStatus;
};

export type TServiceMetadata = {
  id: string;
  status: IndexingStatus;
  indexerEndpoint: string;
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
  chain: number;
  specName: string;
  genesisHash: string;
  indexerHealthy: boolean;
  indexerNodeVersion: string;
  queryNodeVersion: string;
};
