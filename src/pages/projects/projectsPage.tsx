// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useWeb3 } from '../../hooks/web3Hook';
import { Container, HeaderContainer } from './styles';
import { Text, Button } from '../../components/primary';
import ProjecItemsHeader from './components/projecItemsHeader';
import ProjectItem from './components/projectItem';

const items = [1, 2, 3, 4, 5];

const Projects = () => {
  const { account } = useWeb3();

  return (
    <Container>
      <HeaderContainer>
        <Text size={45}>Projects</Text>
        <Button title="Add Project" onClick={() => console.log('add project')} />
      </HeaderContainer>
      <ProjecItemsHeader />
      {items.map(() => (
        <ProjectItem />
      ))}
    </Container>
  );
};

export default Projects;
