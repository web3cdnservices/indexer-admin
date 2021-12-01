// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { IndexingStatus } from '../projects/constant';

export type Metadata = {
  chain: string;
  specName: string;
  lastProcessedTimestamp: number;
  lastProcessedHeight: number;
  targetHeight: number;
  genesisHash: string;
  indexerHealthy: boolean;
  indexerNodeVersion: string;
  queryNodeVersion: string;
};

export type TProject = {
  id: string;
  name: string;
  title: string;
  progress: number;
  status: IndexingStatus;
};

export type TService = {
  name: string;
  status: string;
  url: string;
  imageVersion: string;
};
