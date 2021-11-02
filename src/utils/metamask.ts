// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable */ 

import { connect } from '../containers/web3';

export const connectWithMetaMask = async (activate: Function) => {
  // @ts-ignore
  if (window?.ethereum) {
    // @ts-ignore
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    // @ts-ignore
    await connect(activate);
  }
};
