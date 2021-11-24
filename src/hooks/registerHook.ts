// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { RegisterStep } from '../pages/register/types';
import { useIsApproved, useIsIndexer } from './indexerHook';

export const useInitialStep = (): RegisterStep => {
  const isIndexer = useIsIndexer();
  const isApproved = useIsApproved();

  if (isIndexer) return RegisterStep.sync;
  if (isApproved) return RegisterStep.register;
  return RegisterStep.onboarding;
};
