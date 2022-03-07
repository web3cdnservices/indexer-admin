// Copyright 2020-2022 SubQuery Pte Ltd authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { IndexingStatus } from './constant';

export type TProject = {
  id: string;
  status: IndexingStatus;
  indexEndpoint?: string;
  queryEndpoint?: string;
};
