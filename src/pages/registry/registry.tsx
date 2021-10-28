// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Snackbar } from '@mui/material';
import Alert from '@mui/material/Alert';
import { useState, useEffect } from 'react';
import { useContractSDK } from '../../containers/contractSdk';
import TokenBalance from '../../components/balance';
import { Container, ActionButton, Text, ButtonsContainer, ConnectButton } from './styles';
import { useIsIndexer } from '../../hooks/indexerHook';
import { useWeb3 } from '../../hooks/web3Hook';

const ALERT_MESSAGE = 'SDK not initialised';

const Registry = () => {
  const { account, library, active, connector } = useWeb3();
  console.log('account changed', account);
  const isIndexer = useIsIndexer(account ?? '');
  const sdk = useContractSDK();

  const [alert, setAlert] = useState('');
  const [controller, setController] = useState('');

  // TODO: move to helper file
  const connectWithMetaMask = () => {
    // @ts-ignore
    if (window?.ethereum) {
      // @ts-ignore
      window.ethereum.request({ method: 'eth_requestAccounts' });
      connector?.getAccount();
    }
  };

  const registry = () => {
    if (!sdk || !library) {
      setAlert(ALERT_MESSAGE);
      return;
    }

    sdk?.indexerRegistry.connect(library.getSigner()).registerIndexer(10000000);
  };

  const unRegister = () => {
    if (!sdk || !library) {
      setAlert(ALERT_MESSAGE);
      return;
    }

    sdk?.indexerRegistry.connect(library.getSigner()).unregisterIndexer();
  };

  const configController = () => {
    if (!sdk || !library) {
      setAlert(ALERT_MESSAGE);
      return;
    }

    const controllerAccount = '0xCbB6924D74B9EA32f95695A707d3bEcDBd429409';
    sdk?.indexerRegistry
      .connect(library.getSigner())
      .setControllerAccount(controllerAccount)
      .then(() => setController(controllerAccount));
  };

  const renderContents = () => {
    return (
      <div>
        <Text>Account: {account}</Text>
        {!!account && <TokenBalance account={account} />}
        {controller && <Text>Controller Account:</Text>}
      </div>
    );
  };

  const renderActionComponents = () => (
    <ButtonsContainer>
      <ActionButton variant="contained" color="primary" onClick={() => registry()}>
        Registry
      </ActionButton>
      {isIndexer && (
        <ActionButton variant="contained" color="primary" onClick={() => unRegister()}>
          Unregistry
        </ActionButton>
      )}
      {isIndexer && (
        <ActionButton variant="contained" color="primary" onClick={() => configController()}>
          Config Controller
        </ActionButton>
      )}
    </ButtonsContainer>
  );

  const renderConnectionButtons = () => (
    <ButtonsContainer>
      <ConnectButton variant="outlined" color="info" onClick={() => connectWithMetaMask()}>
        {active ? 'Disconnect' : 'Connect'}
      </ConnectButton>
    </ButtonsContainer>
  );

  return (
    <Container>
      {renderContents()}
      {renderActionComponents()}
      {renderConnectionButtons()}
      {alert && (
        <Snackbar open={!!alert} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
          <Alert severity="error" onClose={() => setAlert('')} sx={{ width: '100%' }}>
            {alert}
          </Alert>
        </Snackbar>
      )}
    </Container>
  );
};

export default Registry;
