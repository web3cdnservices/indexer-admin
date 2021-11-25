// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { IndexingStatus } from '../projects/constant';

export type TProject = {
  id: string;
  name: string;
  status: IndexingStatus;
};
