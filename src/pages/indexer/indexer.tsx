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
import { Container, ActionButton, ButtonsContainer, ConnectButton, Separator } from './styles';
import AccountCard from '../../components/accountCard';
import TransactionPanel from '../../components/transactionPanel';
import Alert from '../../components/alert';
import { TransactionType } from '../../utils/transactions';
import { emptyControllerAccount, unRegister } from '../../utils/indexerActions';
import { connectWithMetaMask } from '../../utils/metamask';
import QueryHelper from '../../mock/queryHelper';
import { ADD_PROJECT, GET_PROJECTS } from '../../utils/queries';
import { useProject } from '../../hooks/projectHook';

const indexerActions = {
  approve: 'Request Approve',
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
  const event = useIndexerEvent();

  const signer = useSigner();
  const sdk = useContractSDK();

  const [displayTxPanel, setDisplayTxPanel] = useState(false);
  const [txType, setTxType] = useState<TransactionType | undefined>(undefined);
  const [alert, setAlert] = useState('');

  // FIXME: test for graphql request
  // const projectID = '0xf7F5Edc7dfE5B475E45F6E54a8433B15968c69xx';
  // const queryService = 'https://api.subquery.network/sq/subvis-io/kusama-auction';
  // const [addProject, { data, loading, error }] = useMutation(ADD_PROJECT);
  // const { data, loading, error } = useQuery(GET_PROJECTS);
  const { data, error, loading } = useProject('1243242342424');
  if (loading) console.log('Submitting...:', loading);
  // @ts-ignore
  if (error) console.log(`Submission error! ${error}`);
  if (data) console.log('>>>request', data);

  useEffect(() => {
    setAlert(event);
  }, [event]);

  const isControllerEmpty = () =>
    !isController && (!controller || controller === emptyControllerAccount);

  const showTransactionPanel = (type: TransactionType) => {
    setTxType(type);
    setDisplayTxPanel(true);
  };

  const renderConnectionButtons = () => (
    <ButtonsContainer>
      <ConnectButton variant="outlined" color="info" onClick={() => connectWithMetaMask(activate)}>
        Connect with MetaMask
      </ConnectButton>
    </ButtonsContainer>
  );

  const renderIndexerButtons = () => (
    <ButtonsContainer>
      {!isIndexer && !isController && isMetaMask && (
        <ActionButton
          variant="contained"
          color="primary"
          onClick={() => showTransactionPanel(TransactionType.approve)}
        >
          {indexerActions.approve}
        </ActionButton>
      )}
      {!isIndexer && !isController && isMetaMask && (
        <ActionButton
          variant="contained"
          color="primary"
          onClick={() => showTransactionPanel(TransactionType.registry)}
        >
          {indexerActions.registry}
        </ActionButton>
      )}
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
        <AccountCard
          title={isIndexer || isController ? 'Indexer' : 'Account'}
          account={isController ? indexer : account}
          actionItems={renderIndexerButtons()}
        />
      )}
      <Separator height={30} />

      {!isControllerEmpty() && (
        <AccountCard title="Controller" account={isController ? account : controller} />
      )}
      {!isMetaMask && renderConnectionButtons()}
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
