// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useEffect, useState } from 'react';
import { useMutation, useLazyQuery } from '@apollo/client';
import { useIsMetaMask, useSigner } from '../../hooks/web3Hook';
import { Container, ContentContainer, HeaderContainer } from './styles';
import { Text, Button } from '../../components/primary';
import ProjecItemsHeader from './components/projecItemsHeader';
import Modal from '../../components/actionModal';
import ProjectItem from './components/projectItem';
import ModalContent from './components/modalContent';
import { ADD_PROJECT, GET_PROJECTS } from '../../utils/queries';
import { FormValues } from './types';
import { FormKey } from './constant';
import { TProject } from '../project-details/types';
import { createQueryProject, getProjectIds } from '../../mock/queryRegistry';
import { useContractSDK } from '../../containers/contractSdk';

const Projects = () => {
  // FIXME: just for local test, output all projects, remove later
  const sdk = useContractSDK();
  const signer = useSigner();
  // createQueryProject(sdk, signer)
  // setVisible(true)

  const isMetaMask = useIsMetaMask();
  const [addProject, { loading }] = useMutation(ADD_PROJECT);
  const [getProjects, { data }] = useLazyQuery(GET_PROJECTS);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    getProjects();
    // FIXME: just for local test, output all projects, remove later
    console.log(getProjectIds());
  }, []);

  const addProjectComplete = () => {
    setVisible(false);
    // FIXME: projects doesn't update after this request.
    getProjects();
  };

  const onAddProjectRequest = (values: FormValues) => {
    // TODO: 1. check is valid `deployment id`
    addProject({ variables: { id: values[FormKey.ADD_PROJECT] } }).then(addProjectComplete);
  };

  return (
    <Container>
      {isMetaMask && (
        <ContentContainer>
          <HeaderContainer>
            <Text size={45}>Projects</Text>
            <Button title="Add Project" onClick={() => setVisible(true)} />
          </HeaderContainer>
          {!!data && data.getProjects.length > 0 && <ProjecItemsHeader />}
          {data?.getProjects.map((props: TProject) => (
            <ProjectItem key={props.id} {...props} />
          ))}
        </ContentContainer>
      )}
      <Modal title="Add new roject" visible={visible} onClose={() => setVisible(false)}>
        <ModalContent loading={loading} onClick={onAddProjectRequest} />
      </Modal>
    </Container>
  );
};

export default Projects;
