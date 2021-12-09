// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import * as crypto from 'crypto';

import { IndexingStatus } from './constant';

const createProjectItem = (id: string, title: string, progress: number, status: number) => ({
  id,
  title,
  progress,
  status,
});

const randomID = () => crypto.randomBytes(25).toString('hex');

export const mockProjects = [
  createProjectItem(randomID(), 'Sushi Swap', 0, IndexingStatus.NOTSTART),
  createProjectItem(randomID(), 'Moonbeam', 10, IndexingStatus.INDEXING),
  createProjectItem(randomID(), 'Parallel Finance', 80, IndexingStatus.INDEXING),
  createProjectItem(randomID(), 'Astar', 0, IndexingStatus.NOTSTART),
  createProjectItem(randomID(), 'Clover', 100, IndexingStatus.READY),
  createProjectItem(randomID(), 'SubDao', 100, IndexingStatus.READY),
  createProjectItem(randomID(), 'SubGame', 0, IndexingStatus.TERMINATED),
];
