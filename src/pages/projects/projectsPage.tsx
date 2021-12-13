// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { useLazyQuery, useMutation } from '@apollo/client';
import { isEmpty, isUndefined } from 'lodash';

import ModalView from 'components/modalView';
import { Button, Text } from 'components/primary';
import { useLoading } from 'containers/loadingContext';
import { useController, useIsIndexer } from 'hooks/indexerHook';
import { getProject, getProjectDetails, ProjectDetails } from 'hooks/projectHook';
import { useIsMetaMask } from 'hooks/web3Hook';
import MetaMaskView from 'pages/metamask/metamaskView';
import { TProject } from 'pages/project-details/types';
import { ProjectFormKey } from 'types/schemas';
import { ADD_PROJECT, GET_PROJECTS } from 'utils/queries';
import { ActionType } from 'utils/transactions';

import ProjecItemsHeader from './components/projecItemsHeader';
import ProjectItem from './components/projectItem';
import { createAddProjectSteps } from './constant';
import { Container, ContentContainer, HeaderContainer } from './styles';

const Projects = () => {
  const isMetaMask = useIsMetaMask();
  const isIndexer = useIsIndexer();
  const controller = useController();
  const history = useHistory();
  const { setPageLoading } = useLoading();
  const [addProject, { loading }] = useMutation(ADD_PROJECT);
  const [getProjects, { data }] = useLazyQuery(GET_PROJECTS, { fetchPolicy: 'network-only' });

  const [projects, setProjects] = useState<ProjectDetails[]>();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setPageLoading(isUndefined(isIndexer));
    // FIXME: move this to root page logic
    if (!isUndefined(isIndexer) && !isIndexer) {
      history.replace('/');
    } else if (!isUndefined(controller) && !controller) {
      history.replace('/account');
    }
  }, [isIndexer]);

  const getProjectDetailList = useCallback(async () => {
    const projectList = data?.getProjects as TProject[];
    if (isUndefined(projectList)) return;
    if (isEmpty(projectList)) {
      setPageLoading(false);
      return;
    }

    try {
      const projectDetailList = await Promise.all(
        projectList.map(({ id }) => getProjectDetails(id))
      );
      setProjects(projectDetailList);
      setPageLoading(false);
    } catch (_) {
      setPageLoading(false);
    }
  }, [data]);

  useEffect(() => {
    setPageLoading(true);
    getProjects();
  }, []);

  useEffect(() => {
    getProjectDetailList();
  }, [getProjectDetailList]);

  const onModalClose = () => {
    setVisible(false);
  };

  const step = createAddProjectSteps(async (values, helper) => {
    try {
      const id = values[ProjectFormKey.deploymentId];
      const r = await getProject(id);
      console.log('>>>add project:', r);
      await addProject({ variables: { id } });

      setVisible(false);
      getProjects();
    } catch (_) {
      helper.setErrors({ [ProjectFormKey.deploymentId]: 'Invalid deployment id' });
    }
  });

  return (
    <Container>
      {isMetaMask && isIndexer && (
        <ContentContainer>
          <HeaderContainer>
            <Text size={45}>Projects</Text>
            <Button title="Add Project" onClick={() => setVisible(true)} />
          </HeaderContainer>
          {!!projects && <ProjecItemsHeader />}
          {!!projects &&
            projects.map((props: ProjectDetails) => <ProjectItem key={props.id} {...props} />)}
        </ContentContainer>
      )}
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
