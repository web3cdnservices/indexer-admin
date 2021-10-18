// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { FC, VFC, useCallback, useEffect } from 'react';
import { useWeb3React, Web3ReactProvider } from '@web3-react/core';
import { Web3ReactContextInterface } from '@web3-react/core/dist/types';
import { InjectedConnector } from '@web3-react/injected-connector';
import { NetworkConnector } from '@web3-react/network-connector';
import { AbstractConnector } from '@web3-react/abstract-connector';
import { providers } from 'ethers';
import { Props } from './unstated';
import Logger from './logger';

const RPC_URLS: Record<number, string> = {
  1285: 'wss://moonriver.api.onfinality.io/public-ws',
  1287: 'wss://moonbeam-alpha.api.onfinality.io/public-ws',
};

export const injectedConntector = new InjectedConnector({
  supportedChainIds: [1, 1285, 1287],
});

const networkConnector = new NetworkConnector({
  urls: RPC_URLS,
  defaultChainId: 1285,
});

// TODO: Acala would use https://github.com/AcalaNetwork/bodhi.js
const getLibrary = (provider: any): providers.Web3Provider => {
  return new providers.Web3Provider(provider);
};

export const useWeb3 = (): Web3ReactContextInterface<providers.Web3Provider> => useWeb3React();

const InitProvider: VFC = () => {
  const { activate } = useWeb3();
  const activateInitialConnector = useCallback(async (): Promise<void> => {
    if (await injectedConntector.isAuthorized()) {
      return activate(injectedConntector);
    }

    return activate(networkConnector);
  }, [activate]);

  useEffect(() => {
    activateInitialConnector();
  }, [activateInitialConnector]);

  return null;
};

export const Web3Provider: FC = ({ children }: Props) => {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <InitProvider />
      {children}
    </Web3ReactProvider>
  );
};
