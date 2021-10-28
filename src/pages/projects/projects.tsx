// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useContractSDK } from '../../containers/contractSdk';
import { useSigner } from '../../hooks/web3Hook';
import { Container } from './styles';

const deploymentId = '0xbec921276c8067fe0c82def3e5ecfd8447f1961bc85768c2a56e6bd26d3c0c55';

const Projects = () => {
  const signer = useSigner();
  const sdk = useContractSDK();

  const startIndexing = () => {
    signer && sdk?.queryRegistry.connect(signer).startIndexing(deploymentId);
  };

  const stopIndexing = () => {
    signer && sdk?.queryRegistry.connect(signer).stopIndexing(deploymentId);
  };

  return <Container />;
};

export default Projects;
