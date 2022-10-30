// Copyright 2020-2022 SubQuery Pte Ltd authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useState } from 'react';

import { createContainer } from './unstated';

export type TAccount = {
  account: string;
};

type TAccountContext = {
  account: TAccount | undefined;
  // Add more global vars related with account like controller | balance etc
  updateAccount: (account: TAccount) => void;
};

function useAccountImpl(): TAccountContext {
  const [account, setAccount] = useState<TAccount>();

  return { account, updateAccount: setAccount };
}

export const { useContainer: useAccount, Provider: AccountProvider } = createContainer(
  useAccountImpl,
  { displayName: 'Global Account' }
);
