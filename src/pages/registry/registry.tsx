// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Snackbar } from '@mui/material';
import Alert from '@mui/material/Alert';
import { useState } from 'react';
import { useWeb3 } from '../../containers';
import { connect } from '../../containers/web3';
import { useContractSDK } from '../../containers/contractSdk';
import TokenBalance from '../../components/balance';
import { Container, ActionButton, Text, ButtonsContainer, ConnectButton } from './styles';
import { useIsIndexer } from '../../hooks/indexerHook';

const ALERT_MESSAGE = 'SDK not initialised';

const Registry = () => {
  const { account, library, activate, deactivate, active } = useWeb3();
  const isIndexer = useIsIndexer(account ?? '');
  const sdk = useContractSDK();

  const [alert, setAlert] = useState('');
  const [controller, setController] = useState('');

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
      <ConnectButton
        variant="outlined"
        color="info"
        onClick={() => {
          active ? deactivate() : connect(activate);
        }}
      >
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
