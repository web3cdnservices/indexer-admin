// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { FC, useState, useEffect } from 'react';
import { formatUnits } from '@ethersproject/units';
import { BigNumber } from '@ethersproject/bignumber';
import { useContractSDK } from '../containers/contractSdk';

type Props = {
  account: string;
};

const TokenBalance: FC<Props> = ({ account }) => {
  const [balance, setBalance] = useState<BigNumber>(BigNumber.from(0));
  const sdk = useContractSDK();

  useEffect(() => {
    console.log('>>sdk:', sdk);
    sdk?.sqToken.balanceOf(account).then((balance) => setBalance(balance));
  }, [account]);

  return <div style={{ color: '#d9d9d9', marginLeft: '30px' }}>{formatUnits(balance, 18)} SQT</div>;
};

export default TokenBalance;
