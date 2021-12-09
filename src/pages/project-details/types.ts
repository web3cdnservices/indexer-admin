// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { IndexingStatus } from '../projects/constant';

export type TProject = {
  id: string;
  name: string;
  title: string;
  progress: number;
  status: IndexingStatus;
};

export type TProjectMetadata = {
  id: string;
  status: string;
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
  indexerHealthy: false;
  indexerNodeVersion: string;
  queryNodeVersion: string;
};
