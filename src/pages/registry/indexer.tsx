// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

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
import { Container, ActionButton, ButtonsContainer, ConnectButton, Separator } from './styles';
import AccountCard from '../../components/accountCard';
import TransactionPanel from '../../components/transactionPanel';
import { TransactionType } from '../../utils/transactions';
import { emptyControllerAccount, unRegister } from '../../utils/indexerActions';
import { connectWithMetaMask } from '../../utils/metamask';

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

  const [displayTxPanel, setDisplayTxPanel] = useState(false);
  const [txType, setTxType] = useState<TransactionType | undefined>(undefined);

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
      <AccountCard
        title={isIndexer || isController ? 'Indexer' : 'Account'}
        account={isController ? indexer : account}
        actionItems={renderIndexerButtons()}
      />
      <Separator height={30} />
      {!isControllerEmpty() && (
        <AccountCard title="Controller" account={isController ? account : controller} />
      )}
      {!isMetaMask && renderConnectionButtons()}
      <TransactionPanel
        type={txType}
        display={displayTxPanel}
        onSendTx={() => setDisplayTxPanel(false)}
        onCancelled={() => setDisplayTxPanel(false)}
      />
    </Container>
  );
};

export default Registry;
