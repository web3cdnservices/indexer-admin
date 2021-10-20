// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { FC, useState, useEffect } from 'react';
import { formatUnits } from '@ethersproject/units';
import { BigNumber } from '@ethersproject/bignumber';
import { useContractSDK } from './contractSdk';

type Props = {
  account: string;
};

const TokenBalance: FC<Props> = ({ account }) => {
  const [balance, setBalance] = useState<BigNumber>(BigNumber.from(0));
  const sdk = useContractSDK();

  useEffect(() => {
    sdk?.sqToken.balanceOf(account).then((balance) => setBalance(balance));
  }, [account]);

  return <div>{formatUnits(balance, 18)} SQT</div>;
};

export default TokenBalance;
