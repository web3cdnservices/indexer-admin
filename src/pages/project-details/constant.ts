// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { IndexingStatus } from '../projects/constant';

const createButtonItem = (title: string, action: () => void, color?: string) => ({
  title,
  action,
  color,
});

export const buttonItems = {
  [IndexingStatus.NOTSTART]: [
    createButtonItem('Start Indexing', () => console.log('Start Indexing')),
  ],
  [IndexingStatus.INDEXING]: [
    createButtonItem('Publish to Ready', () => console.log('Ready Indexing')),
    createButtonItem('Stop Indexing', () => console.log('Stop Indexing')),
  ],
  [IndexingStatus.READY]: [createButtonItem('Stop Indexing', () => console.log('Stop Indexing'))],
  [IndexingStatus.TERMINATED]: [],
};
