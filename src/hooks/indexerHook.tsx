// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useEffect, useState } from 'react';
import { useContractSDK } from '../containers/contractSdk';

export const useIsIndexer = (account: string) => {
  const [isIndexer, setIsIndexer] = useState(false);
  const sdk = useContractSDK();

  useEffect(() => {
    !!account &&
      sdk?.indexerRegistry.isIndexer(account).then((isIndexer) => setIsIndexer(isIndexer));
  }, [account]);

  return isIndexer;
};
