// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useEffect, useState } from 'react';
import { useLazyQuery, useMutation } from '@apollo/client';

import Loading from 'components/loading';
import ModalView from 'components/modalView';
import { Button, Text } from 'components/primary';
import { useIsIndexer } from 'hooks/indexerHook';
import { useDefaultLoading } from 'hooks/projectHook';
import { useIsMetaMask } from 'hooks/web3Hook';
import { ProjectFormKey } from 'types/schemas';
import { ADD_PROJECT, GET_PROJECTS } from 'utils/queries';
import { ActionType } from 'utils/transactions';

import MetaMaskView from '../login/metamaskView';
import { TProject } from '../project-details/types';
import ProjecItemsHeader from './components/projecItemsHeader';
import ProjectItem from './components/projectItem';
import { createAddProjectSteps } from './constant';
import { Container, ContentContainer, HeaderContainer } from './styles';

const Projects = () => {
  const isMetaMask = useIsMetaMask();
  const isIndexer = useIsIndexer();
  const defaultLoading = useDefaultLoading();
  const [addProject, { loading }] = useMutation(ADD_PROJECT);
  const [getProjects, { data }] = useLazyQuery(GET_PROJECTS, { fetchPolicy: 'network-only' });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    getProjects();
  }, []);

  const addProjectComplete = () => {
    setVisible(false);
    getProjects();
  };

  const onModalClose = () => {
    setVisible(false);
  };

  const step = createAddProjectSteps((values, helper) => {
    const id = values[ProjectFormKey.deploymentId];
    // TODO: verify deployment id -> format & whether exist
    helper.setErrors({ [ProjectFormKey.deploymentId]: 'Invalid deployment id' });
    addProject({ variables: { id } }).then(addProjectComplete).catch(onModalClose);
  });

  return (
    <Container>
      {!defaultLoading && isMetaMask && isIndexer && (
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
      {defaultLoading && <Loading />}
      <MetaMaskView />
      <ModalView
        visible={visible}
        // @ts-ignore
        title={step.addProject[0].title}
        onClose={onModalClose}
        // @ts-ignore
        steps={step.addProject}
        currentStep={0}
        type={ActionType.addProject}
        loading={loading}
      />
    </Container>
  );
};

export default Projects;
