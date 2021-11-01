// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useContractSDK } from '../../containers/contractSdk';
import { useSigner, useWeb3 } from '../../hooks/web3Hook';
import { Container } from './styles';
import { ActionButton, ButtonsContainer } from '../registry/styles';
import { useIsIndexer, useIsController } from '../../hooks/indexerHook';

// TODO: move to mock actions
const deploymentId = '0xbec921276c8067fe0c82def3e5ecfd8447f1961bc85768c2a56e6bd26d3c0c55';

const Projects = () => {
  const signer = useSigner();
  const sdk = useContractSDK();

  const { account } = useWeb3();
  const isIndexer = useIsIndexer(account);
  const isController = useIsController(account);

  const startIndexing = () => {
    signer && sdk?.queryRegistry.connect(signer).startIndexing(deploymentId);
  };

  const reportIndexingStatus = () => {
    // TODO: report ....
    signer && sdk?.queryRegistry.connect(signer).startIndexing(deploymentId);
  };

  const stopIndexing = () => {
    signer && sdk?.queryRegistry.connect(signer).stopIndexing(deploymentId);
  };

  const renderActionComponents = () => (
    <ButtonsContainer>
      {isIndexer && (
        <ActionButton variant="contained" color="primary" onClick={() => startIndexing()}>
          Start Indexing
        </ActionButton>
      )}
      {isIndexer && (
        <ActionButton variant="contained" color="primary" onClick={() => stopIndexing()}>
          Stop Indexing
        </ActionButton>
      )}
      {isController && (
        <ActionButton variant="contained" color="primary" onClick={() => reportIndexingStatus()}>
          Report Indexing Status
        </ActionButton>
      )}
    </ButtonsContainer>
  );

  return <Container>{renderActionComponents()}</Container>;
};

export default Projects;
