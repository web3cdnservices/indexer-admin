// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useState } from 'react';
import { useIsMetaMask } from '../../hooks/web3Hook';
import LoginView from './loginView';
import MetaMaskView from './metamaskView';
import RegisterPage from './register/registerPage';
import { Container } from './styles';

const LoginPage = () => {
  const isMetaMask = useIsMetaMask();
  const [isConnectService, setIsConenct] = useState(false);

  return (
    <Container>
      {!isConnectService && <LoginView onConnected={() => setIsConenct(true)} />}
      {isConnectService && !isMetaMask && <MetaMaskView />}
      {isConnectService && isMetaMask && <RegisterPage />}
    </Container>
  );
};

export default LoginPage;
