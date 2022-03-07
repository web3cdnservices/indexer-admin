// Copyright 2020-2022 SubQuery Pte Ltd authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useEffect, useMemo, useState } from 'react';
import { isUndefined } from 'lodash';

import { useContractSDK } from 'containers/contractSdk';
import { useWeb3 } from 'hooks/web3Hook';
import { RegisterStep } from 'pages/register/types';

export const useIsApproved = () => {
  const [isApprove, setIsApprove] = useState<boolean>();
  const { account } = useWeb3();
  const sdk = useContractSDK();

  useEffect(() => {
    if (!account) return;
    sdk?.sqToken
      .allowance(account, sdk?.staking.address)
      .then((amount) => setIsApprove(!amount.eq(0)))
      .catch(() => setIsApprove(false));
  }, [sdk, account]);

  return isApprove;
};

export const useInitialStep = (): RegisterStep | undefined => {
  const isApproved = useIsApproved();

  return useMemo(() => {
    if (isUndefined(isApproved)) return undefined;
    if (isApproved) return RegisterStep.register;
    return RegisterStep.onboarding;
  }, [isApproved]);
};
