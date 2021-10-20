// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useEffect, FC } from 'react';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import useSWR from 'swr';
import { Contract } from '@ethersproject/contracts';
import { formatUnits } from '@ethersproject/units';
import SQToken from '../contracts/abi/SQToken.json';
import { fetcher } from '../utils/fetcher';

type Props = {
  address: string;
};

const TokenBalance: FC<Props> = ({ address }) => {
  const { account, library } = useWeb3React<Web3Provider>();
  const { data: balance, mutate } = useSWR([address, 'balanceOf', account], {
    fetcher: fetcher(library, SQToken.abi),
  });

  useEffect(() => {
    if (!library) return;

    const contract = new Contract(address, SQToken.abi, library.getSigner());
    const fromMe = contract.filters.Transfer(account, null);
    library.on(fromMe, () => mutate(undefined, true));

    const toMe = contract.filters.Transfer(null, account);
    library.on(toMe, () => mutate(undefined, true));

    // eslint-disable-next-line consistent-return
    return () => {
      library.removeAllListeners(toMe);
      library.removeAllListeners(fromMe);
    };
  }, []);

  if (!balance) {
    return <div>No balance</div>;
  }

  return <div>{formatUnits(balance, 18)} SQT</div>;
};

export default TokenBalance;
