// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useState, useEffect } from 'react';

import { useHistory } from 'react-router-dom';
import {
  useController,
  useIndexerEvent,
  useIsController,
  useIsControllerChanged,
  useIsIndexer,
  useIsIndexerChanged,
} from '../../hooks/indexerHook';
import { useIsMetaMask, useWeb3 } from '../../hooks/web3Hook';
import { Container, Separator } from './styles';
import prompts from './prompts';
import AccountCard from '../../components/accountCard';
import TransactionPanel from '../../components/transactionPanel';
import Alert from '../../components/alert';
import { TransactionType } from '../../utils/transactions';
import MetaMaskView from '../login/metamaskView';

const Registry = () => {
  const [displayTxPanel, setDisplayTxPanel] = useState(false);
  const [timestamp, setTimestamp] = useState(Date.now());
  const [txType, setTxType] = useState<TransactionType | undefined>(undefined);
  const [alert, setAlert] = useState('');

  const { account } = useWeb3();
  const history = useHistory();
  const isMetaMask = useIsMetaMask();
  const isIndexer = useIsIndexer();
  const isController = useIsController(account);
  const controller = useController(account, timestamp);
  const event = useIndexerEvent();

  const { request: checkIsIndexerChanged, loading: indexerLoading } = useIsIndexerChanged();
  const { request: checkIsControllerChanged, loading: controllerLoading } =
    useIsControllerChanged(account);

  // TODO: `desc` should be a real time string other than fixed one
  const controllerItem = !controller ? prompts.emptyController : prompts.controller;
  const { indexer } = prompts;

  useEffect(() => {
    setAlert(event);
  }, [event]);

  const showTransactionPanel = (type: TransactionType) => {
    setTxType(type);
    setDisplayTxPanel(true);
  };

  // TODO: display empty view if the current account is invalid

  return (
    <Container>
      {isMetaMask && isIndexer && (
        <AccountCard
          title={indexer.title}
          name={indexer.name}
          buttonTitle={indexer.buttonTitle}
          account={account ?? ''}
          status="active"
          desc={indexer.desc}
          loading={indexerLoading}
          onClick={() => {
            // FIXME: should call when sending the transaction
            checkIsIndexerChanged(false, () => history.replace('./'));
            showTransactionPanel(TransactionType.unregister);
          }}
        />
      )}
      {(isIndexer || isController) && (
        <AccountCard
          title={controllerItem.title}
          name={controllerItem.name}
          account={controller}
          buttonTitle={isIndexer ? controllerItem.buttonTitle : ''}
          desc={controllerItem.desc}
          loading={controllerLoading}
          onClick={() => {
            // FIXME: should call and get the target controller address when sending the transaction
            checkIsControllerChanged('0x3Cd0A705a2DC65e5b1E1205896BaA2be8A07c6e0', () =>
              setTimestamp(Date.now())
            );
            showTransactionPanel(TransactionType.configCntroller);
          }}
        />
      )}
      {!isMetaMask && <MetaMaskView />}

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
