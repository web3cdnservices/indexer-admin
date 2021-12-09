// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useState } from 'react';

import { useIsMetaMask } from 'hooks/web3Hook';

import RegisterPage from '../register/registerPage';
import LoginView from './loginView';
import MetaMaskView from './metamaskView';
import { Container } from './styles';

const LoginPage = () => {
  const isMetaMask = useIsMetaMask();
  const [isConnected, setIsConenct] = useState(false);

  return (
    <Container>
      {!isConnected && <LoginView onConnected={() => setIsConenct(true)} />}
      {isConnected && <MetaMaskView />}
      {isConnected && isMetaMask && <RegisterPage />}
    </Container>
  );
};

export default LoginPage;
