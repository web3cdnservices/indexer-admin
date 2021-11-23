// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useState, useEffect } from 'react';
// import { useMutation, useQuery } from '@apollo/client';

import { useContractSDK } from '../../containers/contractSdk';
import {
  useController,
  useControllerToIndexer,
  useIndexerEvent,
  useIsController,
  useIsIndexer,
} from '../../hooks/indexerHook';
import { useIsMetaMask, useSigner, useWeb3 } from '../../hooks/web3Hook';
import { Container, ActionButton, ButtonsContainer, Separator } from './styles';
import AccountCard from '../../components/accountCard';
import TransactionPanel from '../../components/transactionPanel';
import Alert from '../../components/alert';
import { TransactionType } from '../../utils/transactions';
import { emptyControllerAccount, unRegister } from '../../utils/indexerActions';
import QueryHelper from '../../mock/queryHelper';

const indexerActions = {
  approve: 'Request Approve',
  registry: 'Registry',
  unRegister: 'Unregistry',
  configController: 'Config Controller',
};

const Registry = () => {
  const { account } = useWeb3();
  const isMetaMask = useIsMetaMask();
  const isIndexer = useIsIndexer();
  const isController = useIsController(account);
  const controller = useController(account);
  const indexer = useControllerToIndexer(account);
  const event = useIndexerEvent();

  const signer = useSigner();
  const sdk = useContractSDK();

  const [displayTxPanel, setDisplayTxPanel] = useState(false);
  const [txType, setTxType] = useState<TransactionType | undefined>(undefined);
  const [alert, setAlert] = useState('');

  useEffect(() => {
    setAlert(event);
  }, [event]);

  const isControllerEmpty = () =>
    !isController && (!controller || controller === emptyControllerAccount);

  const showTransactionPanel = (type: TransactionType) => {
    setTxType(type);
    setDisplayTxPanel(true);
  };

  const renderIndexerButtons = () => (
    <ButtonsContainer>
      {isIndexer && (
        <ActionButton
          variant="contained"
          color="primary"
          onClick={() => showTransactionPanel(TransactionType.configCntroller)}
        >
          {indexerActions.configController}
        </ActionButton>
      )}
      {isIndexer && (
        <ActionButton variant="contained" color="primary" onClick={() => unRegister(sdk, signer)}>
          {indexerActions.unRegister}
        </ActionButton>
      )}
    </ButtonsContainer>
  );

  return (
    <Container>
      <Separator height={80} />
      {isMetaMask && (
        <AccountCard title="Indexer Account" account={account} desc="Staking: 10000 SQT" />
      )}
      <Separator height={30} />
      <AccountCard title="Controller Account" account={controller} desc="Balance: 200 SQT" />
      <QueryHelper />
      <TransactionPanel
        type={txType}
        display={displayTxPanel}
        onSendTx={() => setDisplayTxPanel(false)}
        onCancelled={() => setDisplayTxPanel(false)}
      />
      <Alert severity="success" message={alert} onClose={() => setAlert('')} />
    </Container>
  );
};

export default Registry;
