// Copyright 2020-2022 SubQuery Pte Ltd authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable */
// @ts-nocheck

import { NetworkToChainID, NETWORK_CONFIGS } from 'utils/web3';
import { intToHex } from 'ethereumjs-util';
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

export async function switchNetwork() {
  const network = window.env.NETWORK;
  const chainId = NetworkToChainID[network];
  if (!window?.ethereum || !network) return;

  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: intToHex(chainId) }],
    })
  } catch (e) {
    if (e.code === 4902) {
      await ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [NETWORK_CONFIGS[chainId]],
      })
    } else {
      console.log('Switch Ethereum network failed', e);
    }
  }
}
