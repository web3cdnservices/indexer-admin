// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useIsMetaMask, useWeb3 } from '../../hooks/web3Hook';
import LoginView from './loginView';
import MetaMaskView from './metamaskView';
import RegisterPage from '../register/registerPage';
import { Container } from './styles';
import { useIsIndexer } from '../../hooks/indexerHook';

const LoginPage = () => {
  const history = useHistory();
  const { account } = useWeb3();
  const isMetaMask = useIsMetaMask();
  const isIndexer = useIsIndexer(account);
  const [isConnected, setIsConenct] = useState(false);

  useEffect(() => {
    if (isConnected && isIndexer) {
      history.replace('/account');
    }
  }, [isIndexer, isConnected]);

  return (
    <Container>
      {!isConnected && <LoginView onConnected={() => setIsConenct(true)} />}
      {isConnected && <MetaMaskView />}
      {isConnected && isMetaMask && <RegisterPage />}
    </Container>
  );
};

export default LoginPage;
