// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Snackbar } from '@mui/material';
import Alert from '@mui/material/Alert';
import { useState } from 'react';
import { useContractSDK } from '../../containers/contractSdk';
import TokenBalance from '../../components/balance';
import { useIsIndexer } from '../../hooks/indexerHook';
import { useIsMetaMask, useSigner, useWeb3 } from '../../hooks/web3Hook';
import { connect } from '../../containers/web3';
import {
  Container,
  ActionButton,
  Text,
  ButtonsContainer,
  ConnectButton,
  TextContainer,
} from './styles';

const ALERT_MESSAGE = 'SDK not initialised';

const Registry = () => {
  const { account, activate } = useWeb3();
  const isMetaMask = useIsMetaMask();
  const isIndexer = useIsIndexer(account ?? '');
  const signer = useSigner();
  const sdk = useContractSDK();

  const [alert, setAlert] = useState('');
  const [controller, setController] = useState('');

  // TODO: move to helper file
  const connectWithMetaMask = async () => {
    // @ts-ignore
    if (window?.ethereum) {
      // @ts-ignore
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      await connect(activate);
    }
  };

  const registry = () => {
    if (!sdk || !signer) {
      setAlert(ALERT_MESSAGE);
      return;
    }

    sdk?.indexerRegistry.connect(signer).registerIndexer(10000000);
  };

  const unRegister = () => {
    if (!sdk || !signer) {
      setAlert(ALERT_MESSAGE);
      return;
    }

    sdk?.indexerRegistry.connect(signer).unregisterIndexer();
  };

  const configController = () => {
    if (!sdk || !signer) {
      setAlert(ALERT_MESSAGE);
      return;
    }

    const controllerAccount = '0xCbB6924D74B9EA32f95695A707d3bEcDBd429409';
    sdk?.indexerRegistry
      .connect(signer)
      .setControllerAccount(controllerAccount)
      .then(() => setController(controllerAccount));
  };

  const renderContents = () => {
    return (
      <div>
        {!!account && (
          <TextContainer>
            <Text>{account}</Text>
            <TokenBalance account={account} />
          </TextContainer>
        )}
        {controller && <Text>Controller Account:</Text>}
      </div>
    );
  };

  const renderActionComponents = () => (
    <ButtonsContainer>
      {!isIndexer && isMetaMask && (
        <ActionButton variant="contained" color="primary" onClick={() => registry()}>
          Registry
        </ActionButton>
      )}
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
      <ConnectButton variant="outlined" color="info" onClick={connectWithMetaMask}>
        Connect with MetaMask
      </ConnectButton>
    </ButtonsContainer>
  );

  return (
    <Container>
      {renderContents()}
      {renderActionComponents()}
      {!isMetaMask && renderConnectionButtons()}
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
