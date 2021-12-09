// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { RegisterStep } from '../pages/register/types';
import { useIsApproved } from './indexerHook';

export const useInitialStep = (): RegisterStep => {
  const isApproved = useIsApproved();

  if (isApproved) return RegisterStep.register;
  return RegisterStep.onboarding;
};
