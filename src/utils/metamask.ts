// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable */ 
// @ts-nocheck 

import { intToHex } from 'ethereumjs-util';
import { connect, ChainID } from '../containers/web3';

export const NetworkError = {
  unSupportedNetworkError: 'UnsupportedChainIdError',
};

export async function connectWithMetaMask(activate: Function) {
  if (window?.ethereum) {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    await connect(activate);
    return;
  }
};

export async function switchNetwork(chainId: ChainID) {
  if (!window?.ethereum) return;
  try {
    return window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: intToHex(chainId) }],
    });
  } catch (switchError) {
    // This error code indicates that the chain has not been added to MetaMask.
    if (switchError.code === 4902) {
      // TODO: https://docs.metamask.io/guide/rpc-api.html#other-rpc-methods
      try {
        await ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{ chainId: '0xf00', rpcUrl: 'https://...' /* ... */ }],
        });
      } catch (addError) {
        // handle "add" error
      }
    }
    // handle other "switch" errors
  }
}
