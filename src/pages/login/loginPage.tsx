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
  const [isConnectService, setIsConenct] = useState(false);

  useEffect(() => {
    if (isConnectService && isIndexer) {
      // FIXME: push all replace | push in utils
      history.replace('/account');
    }
  }, [isIndexer, isConnectService]);

  return (
    <Container>
      {!isConnectService && <LoginView onConnected={() => setIsConenct(true)} />}
      {isConnectService && !isMetaMask && <MetaMaskView />}
      {isConnectService && isMetaMask && <RegisterPage />}
    </Container>
  );
};

export default LoginPage;
