// Copyright 2020-2022 SubQuery Pte Ltd authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { FC, useCallback, useEffect, VFC } from 'react';
import { Web3ReactProvider } from '@web3-react/core';
import { Web3ReactManagerFunctions } from '@web3-react/core/dist/types';
import { InjectedConnector } from '@web3-react/injected-connector';
import { NetworkConnector } from '@web3-react/network-connector';
import { providers } from 'ethers';

import { useWeb3 } from 'hooks/web3Hook';
import { NetworkToChainID, RPC_URLS } from 'utils/web3';

import { Props } from './unstated';

const injectedConntector = new InjectedConnector({
  supportedChainIds: [595, 1281, 1285],
});

const injectNetwork = window.env.NETWORK as keyof typeof NetworkToChainID;

const networkConnector = new NetworkConnector({
  urls: RPC_URLS,
  defaultChainId: (NetworkToChainID[injectNetwork] as number) ?? 595,
});

// TODO: Acala would use https://github.com/AcalaNetwork/bodhi.js
const getLibrary = (provider: any): providers.Web3Provider => {
  return new providers.Web3Provider(provider);
};

export async function connect(activate: Web3ReactManagerFunctions['activate']): Promise<void> {
  if (await injectedConntector.isAuthorized()) {
    return activate(injectedConntector);
  }

  return activate(networkConnector);
}

const InitProvider: VFC = () => {
  const { activate } = useWeb3();
  const activateInitialConnector = useCallback(
    async (): Promise<void> => connect(activate),
    [activate]
  );

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
