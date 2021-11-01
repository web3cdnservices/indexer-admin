// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Snackbar } from '@mui/material';
import Alert from '@mui/material/Alert';
import { useState } from 'react';
// import { parseEther } from '@ethersproject/units';
import { BigNumberish } from '@ethersproject/bignumber';
import { useContractSDK } from '../../containers/contractSdk';
import Balance from '../../components/balance';
import { useController, useIsController, useIsIndexer } from '../../hooks/indexerHook';
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
import { createQueryProject } from '../../mock/queryRegistry';
import Projects from '../projects/projects';

// TODO: set a global alert, maybe put in contextProvider
const ALERT_MESSAGE = 'SDK not initialised';

const indexerActions = {
  registry: 'Registry',
  unRegister: 'Unregistry',
  configController: 'Config Controller',
};

const Registry = () => {
  const { account, activate } = useWeb3();
  const isMetaMask = useIsMetaMask();
  const isIndexer = useIsIndexer(account);
  const isController = useIsController(account);
  const controller = useController(account);
  const signer = useSigner();
  const sdk = useContractSDK();

  const [alert, setAlert] = useState('');

  // TODO: move to helper file
  const connectWithMetaMask = async () => {
    // @ts-ignore
    if (window?.ethereum) {
      // @ts-ignore
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      await connect(activate);
    }
  };

  const isControllerEmpty = (controllerAccount: string) => {
    return !controllerAccount || controllerAccount === '0x0000000000000000000000000000000000000000';
  };

  // TODO: move to a seperate mock palce
  const buildQueryProject = () => {
    if (!sdk || !signer) {
      setAlert(ALERT_MESSAGE);
      return;
    }

    createQueryProject(sdk, signer);
  };

  const requestApprove = (amount: BigNumberish) => {
    if (!sdk || !signer) {
      setAlert(ALERT_MESSAGE);
      return;
    }

    sdk.sqToken.connect(signer).approve(sdk.staking.address, amount);
  };

  const registry = () => {
    if (!sdk || !signer) {
      setAlert(ALERT_MESSAGE);
      return;
    }

    sdk?.indexerRegistry.connect(signer).registerIndexer(1000000);
  };

  const unRegister = () => {
    if (!sdk || !signer) {
      setAlert(ALERT_MESSAGE);
      return;
    }

    sdk?.indexerRegistry.connect(signer).unregisterIndexer();
  };

  const configController = async () => {
    if (!sdk || !signer) {
      setAlert(ALERT_MESSAGE);
      return;
    }

    const controllerAccount = '0x3Cd0A705a2DC65e5b1E1205896BaA2be8A07c6e0';
    const indexer = await sdk?.indexerRegistry.controllerToIndexer(controllerAccount);
    if (indexer === '0x0000000000000000000000000000000000000000') {
      sdk?.indexerRegistry.connect(signer).setControllerAccount(controllerAccount);
    } else {
      setAlert('Controller account is used by an indexer already');
    }
  };

  const renderContents = () => {
    return (
      <div>
        {!!account && (
          <TextContainer>
            {isIndexer && <Text>Indexer:</Text>}
            <Text>{account}</Text>
            <Balance account={account} />
          </TextContainer>
        )}
        {!isControllerEmpty(controller) && isIndexer && (
          <TextContainer>
            <Text>Controller:</Text>
            <Text>{controller}</Text>
            <Balance account={controller} />
          </TextContainer>
        )}
      </div>
    );
  };

  const renderActionComponents = () => (
    <ButtonsContainer>
      {!isIndexer && !isController && isMetaMask && (
        <ActionButton variant="contained" color="primary" onClick={() => registry()}>
          {indexerActions.registry}
        </ActionButton>
      )}
      {!isIndexer && !isController && isMetaMask && (
        <ActionButton variant="contained" color="primary" onClick={() => requestApprove(1000000)}>
          Request Approve
        </ActionButton>
      )}
      {isIndexer && (
        <ActionButton variant="contained" color="error" onClick={() => unRegister()}>
          {indexerActions.unRegister}
        </ActionButton>
      )}
      {isIndexer && (
        <ActionButton variant="contained" color="primary" onClick={() => configController()}>
          {indexerActions.configController}
        </ActionButton>
      )}
      {isMetaMask && (
        <ActionButton variant="contained" color="primary" onClick={() => buildQueryProject()}>
          Create Query Project
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
      {!isMetaMask && renderConnectionButtons()}
      {renderContents()}
      {renderActionComponents()}
      <Projects />
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
