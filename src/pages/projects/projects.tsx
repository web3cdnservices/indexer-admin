// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useState } from 'react';
import { useIsMetaMask, useWeb3 } from '../../hooks/web3Hook';
import { Container } from './styles';
import { ActionButton, ButtonsContainer } from '../registry/styles';
import { useIsIndexer, useAccountType } from '../../hooks/indexerHook';
import AccountCard from '../../components/accountCard';
import TransactionPanel from '../../components/transactionPanel';
import { TransactionType } from '../../utils/transactions';

const indexerActions = {
  startIndexing: 'Start Indexing',
  stopIndexing: 'Stop Indexing',
};

const Projects = () => {
  const { account } = useWeb3();
  const isIndexer = useIsIndexer(account);
  const isMetaMask = useIsMetaMask();
  const accountType = useAccountType(account);

  const [displayTxPanel, setDisplayTxPanel] = useState(false);
  const [txType, setTxType] = useState<TransactionType | undefined>(undefined);

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
          onClick={() => showTransactionPanel(TransactionType.startIndexing)}
        >
          {indexerActions.startIndexing}
        </ActionButton>
      )}
      {isIndexer && (
        <ActionButton
          variant="contained"
          color="primary"
          onClick={() => showTransactionPanel(TransactionType.startIndexing)}
        >
          {indexerActions.stopIndexing}
        </ActionButton>
      )}
    </ButtonsContainer>
  );

  return (
    <Container>
      {isMetaMask && (
        <AccountCard
          title={accountType || 'Account'}
          account={account ?? ''}
          actionItems={renderIndexerButtons()}
        />
      )}
      <TransactionPanel
        type={txType}
        display={displayTxPanel}
        onSendTx={() => setDisplayTxPanel(false)}
        onCancelled={() => setDisplayTxPanel(false)}
      />
    </Container>
  );
};

export default Projects;
