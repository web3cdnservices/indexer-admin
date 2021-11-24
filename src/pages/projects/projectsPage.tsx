// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useEffect } from 'react';
import { useIsMetaMask, useWeb3 } from '../../hooks/web3Hook';
import { Container, ContentContainer, HeaderContainer } from './styles';
import { Text, Button } from '../../components/primary';
import ProjecItemsHeader from './components/projecItemsHeader';
import ProjectItem from './components/projectItem';
import { mockProjects } from './mock';
import MetaMaskView from '../login/metamaskView';

const Projects = () => {
  const { account } = useWeb3();
  const isMetaMask = useIsMetaMask();

  useEffect(() => {
    // TODO: get projects from `coordinator service`
  }, [account]);

  return (
    <Container>
      {isMetaMask && (
        <ContentContainer>
          <HeaderContainer>
            <Text size={45}>Projects</Text>
            <Button title="Add Project" onClick={() => console.log('add project')} />
          </HeaderContainer>
          <ProjecItemsHeader />
          {mockProjects.map((props) => (
            <ProjectItem {...props} />
          ))}
        </ContentContainer>
      )}
      {!isMetaMask && <MetaMaskView />}
    </Container>
  );
};

export default Projects;
