// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable */
// @ts-nocheck

import { intToHex } from 'ethereumjs-util';
import { NetworkToChainID, chainNames, RPC_URLS } from 'utils/web3';
import { connect } from 'containers/web3';

export const NetworkError = {
  unSupportedNetworkError: 'UnsupportedChainIdError',
};

export async function connectWithMetaMask(activate: Function) {
  if (window.ethereum) {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    await connect(activate);
    return;
  }
}

function addNetwork(chainId: number) {
  const nativeCurrency = {
    name: 'DEV',
    symbol: 'DEV',
    decimals: 18,
  };

  console.info('Add Ethereum network trye', chainId);

  ethereum
    .request({
      method: 'wallet_addEthereumChain',
      params: [
        {
          chainId: intToHex(chainId),
          chainName: chainNames[chainId],
          rpcUrls: [RPC_URLS[chainId]],
          nativeCurrency,
        },
      ],
    })
    .catch((e) => console.error('Add Ethereum network failed', e));
}

export async function switchNetwork() {
  const network = window.env.NETWORK;
  if (!window?.ethereum || !network) return;
  const chainId = NetworkToChainID[network];

  window.ethereum
    .request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: intToHex(chainId) }],
    })
    .catch((e) => {
      if (e.code === 4902) {
        addNetwork(chainId);
      } else {
        console.error('Switch Ethereum network failed', e);
      }
    });
}
