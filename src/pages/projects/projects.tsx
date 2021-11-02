// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useContractSDK } from '../../containers/contractSdk';
import { useIsMetaMask, useSigner, useWeb3 } from '../../hooks/web3Hook';
import { Container } from './styles';
import { ActionButton, ButtonsContainer } from '../registry/styles';
import { useIsIndexer, useIsController, useAccountType } from '../../hooks/indexerHook';
import AccountCard from '../../components/accountCard';

// TODO: move to mock actions
const deploymentId = '0xbec921276c8067fe0c82def3e5ecfd8447f1961bc85768c2a56e6bd26d3c0c55';

const indexerActions = {
  startIndexing: 'Start Indexing',
  stopIndexing: 'Stop Indexing',
};

const controllerActions = {
  reportStatus: 'Report Status',
};

const Projects = () => {
  const signer = useSigner();
  const sdk = useContractSDK();

  const { account } = useWeb3();
  const isIndexer = useIsIndexer(account);
  const isMetaMask = useIsMetaMask();
  const accountType = useAccountType(account);

  const startIndexing = () => {
    signer && sdk?.queryRegistry.connect(signer).startIndexing(deploymentId);
  };

  // const reportIndexingStatus = () => {
  //   // TODO: report ....
  //   signer && sdk?.queryRegistry.connect(signer).startIndexing(deploymentId);
  // };

  const stopIndexing = () => {
    signer && sdk?.queryRegistry.connect(signer).stopIndexing(deploymentId);
  };

  const renderIndexerButtons = () => (
    <ButtonsContainer>
      {isIndexer && (
        <ActionButton variant="contained" color="primary" onClick={() => startIndexing()}>
          {indexerActions.startIndexing}
        </ActionButton>
      )}
      {isIndexer && (
        <ActionButton variant="contained" color="primary" onClick={() => stopIndexing()}>
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
    </Container>
  );
};

export default Projects;
