// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useEffect, useState } from 'react';
import { useIsMetaMask, useWeb3 } from '../../hooks/web3Hook';
import { Container, ContentContainer, HeaderContainer } from './styles';
import { Text, Button } from '../../components/primary';
import ProjecItemsHeader from './components/projecItemsHeader';
import Modal from '../../components/actionModal';
import ProjectItem from './components/projectItem';
import { mockProjects } from './mock';
import MetaMaskView from '../login/metamaskView';
import ModalContent from './components/modalContent';

const Projects = () => {
  const { account } = useWeb3();
  const isMetaMask = useIsMetaMask();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // TODO: get projects from `coordinator service`
  }, [account]);

  return (
    <Container>
      {isMetaMask && (
        <ContentContainer>
          <HeaderContainer>
            <Text size={45}>Projects</Text>
            <Button title="Add Project" onClick={() => setVisible(true)} />
          </HeaderContainer>
          <ProjecItemsHeader />
          {mockProjects.map((props) => (
            <ProjectItem key={props.id} {...props} />
          ))}
        </ContentContainer>
      )}
      {!isMetaMask && <MetaMaskView />}
      <Modal visible={visible} onClose={() => setVisible(false)}>
        <ModalContent />
      </Modal>
    </Container>
  );
};

export default Projects;
