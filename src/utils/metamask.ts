// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable */
// @ts-nocheck

import { intToHex } from 'ethereumjs-util';
import Config from './config';
import { connect, NetworkToChainID, chainNames, RPC_URLS } from 'containers/web3';

export const NetworkError = {
  unSupportedNetworkError: 'UnsupportedChainIdError',
};

export async function connectWithMetaMask(activate: Function) {
  if (window?.ethereum) {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    await connect(activate);
    return;
  }
}

function addNetwork(chainId: number) {
  const nativeCurrency = {
    name: 'SQT',
    symbol: 'SQT',
    decimals: 18,
  };

  ethereum
    .request({
      method: 'wallet_addEthereumChain',
      params: [
        {
          chainId: intToHex(chainId),
          chainName: chainNames[chainId],
          rpcUrl: RPC_URLS[chainId],
          nativeCurrency,
        },
      ],
    })
    .catch((e) => console.error('Add Ethereum network failed', e));
}

export async function switchNetwork() {
  const network = Config.getInstance().getNetwork();
  if (!window?.ethereum || !network) return;
  const chainId = NetworkToChainID[network];

  try {
    return window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: intToHex(chainId) }],
    });
  } catch (e) {
    // This error code indicates that the chain has not been added to MetaMask.
    if (e.code === 4902) {
      addNetwork();
    } else {
      console.error('Switch Ethereum network failed', e);
    }
  }
}
