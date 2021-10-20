// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Contract, providers } from 'ethers';

export const fetcher =
  (library: providers.Web3Provider | undefined, abi?: any) =>
  (...args: [string, string, ...any[]]): Promise<any> | undefined => {
    if (!library) return;

    if (abi) {
      const [address, method, ...params] = args;
      const contract = new Contract(address, abi, library.getSigner());
      // @ts-ignore
      // eslint-disable-next-line consistent-return
      return contract[method](...params);
    }

    const [method, ...params] = args;
    // @ts-ignore
    // eslint-disable-next-line consistent-return
    return library[method](arg2, ...params);
  };
