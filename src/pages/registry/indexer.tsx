// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Snackbar } from '@mui/material';
import Alert from '@mui/material/Alert';
import { useState } from 'react';
// import { parseEther } from '@ethersproject/units';
import { BigNumberish } from '@ethersproject/bignumber';
import { useContractSDK } from '../../containers/contractSdk';
import {
  useController,
  useControllerToIndexer,
  useIsController,
  useIsIndexer,
} from '../../hooks/indexerHook';
import { useIsMetaMask, useSigner, useWeb3 } from '../../hooks/web3Hook';
import { connect } from '../../containers/web3';
import { Container, ActionButton, ButtonsContainer, ConnectButton, Separator } from './styles';
import AccountCard from '../../components/accountCard';
import TransactionPanel from '../../components/transactionPanel';
import { TransactionType } from '../../utils/transactions';

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
  const indexer = useControllerToIndexer(account);

  const signer = useSigner();
  const sdk = useContractSDK();

  const [alert, setAlert] = useState('');
  const [display, setDisplay] = useState(false);
  const [txType, setTxType] = useState<TransactionType | undefined>(undefined);

  // TODO: move to helper file
  const connectWithMetaMask = async () => {
    // @ts-ignore
    if (window?.ethereum) {
      // @ts-ignore
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      await connect(activate);
    }
  };

  const isControllerEmpty = () =>
    !isController && (!controller || controller === '0x0000000000000000000000000000000000000000');

  const getIndexerAccount = () => {
    return isController ? indexer : account;
  };

  const getControllerAccount = () => {
    return isController ? account : controller;
  };

  const getAccountTitle = () => {
    return isIndexer || isController ? 'Indexer' : 'Account';
  };

  const registry = (amount: number) => {
    if (!sdk || !signer) {
      setAlert(ALERT_MESSAGE);
      return;
    }

    // TODO: if balance === 0, should show alert and can not registry

    Promise.all([
      // sdk.sqToken.connect(signer).approve(sdk.staking.address, amount),
      sdk.indexerRegistry.connect(signer).registerIndexer(amount),
    ]);
  };

  const unRegister = () => {
    // if (!sdk || !signer) {
    //   setAlert(ALERT_MESSAGE);
    //   return;
    // }

    setTxType(TransactionType.registry);
    setDisplay(!display);
    // sdk?.indexerRegistry.connect(signer).unregisterIndexer();
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

  // TODO: move to onboarding page
  const renderConnectionButtons = () => (
    <ButtonsContainer>
      <ConnectButton variant="outlined" color="info" onClick={connectWithMetaMask}>
        Connect with MetaMask
      </ConnectButton>
    </ButtonsContainer>
  );

  const renderIndexerButtons = () => (
    <ButtonsContainer>
      {!isIndexer && !isController && isMetaMask && (
        <ActionButton variant="contained" color="primary" onClick={() => registry(1000000)}>
          {indexerActions.registry}
        </ActionButton>
      )}
      {isIndexer && (
        <ActionButton variant="contained" color="primary" onClick={() => configController()}>
          {indexerActions.configController}
        </ActionButton>
      )}
      {isIndexer && (
        <ActionButton variant="contained" color="primary" onClick={() => unRegister()}>
          {indexerActions.unRegister}
        </ActionButton>
      )}
    </ButtonsContainer>
  );

  return (
    <Container>
      <Separator height={80} />
      <AccountCard
        title={getAccountTitle()}
        account={getIndexerAccount()}
        actionItems={renderIndexerButtons()}
      />
      <Separator height={30} />
      {!isControllerEmpty() && <AccountCard title="Controller" account={getControllerAccount()} />}
      {!isMetaMask && renderConnectionButtons()}
      {alert && (
        <Snackbar open={!!alert} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
          <Alert severity="error" onClose={() => setAlert('')} sx={{ width: '100%' }}>
            {alert}
          </Alert>
        </Snackbar>
      )}
      <TransactionPanel type={txType} display={display} onClick={() => console.log('send tx')} />
    </Container>
  );
};

export default Registry;
