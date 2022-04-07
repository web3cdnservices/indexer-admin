// Copyright 2020-2022 SubQuery Pte Ltd authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useEffect, useState } from 'react';
import { useLazyQuery, useMutation } from '@apollo/client';
import { isEmpty, isUndefined } from 'lodash';

import ModalView from 'components/modalView';
import { Button, Text } from 'components/primary';
import { useLoading } from 'containers/loadingContext';
import { useIsIndexer } from 'hooks/indexerHook';
import { ProjectDetails, useProjectDetailList } from 'hooks/projectHook';
import { ProjectFormKey } from 'types/schemas';
import { ADD_PROJECT, GET_PROJECTS } from 'utils/queries';
import { ProjectsAction } from 'utils/transactions';

import ProjecItemsHeader from './components/projecItemsHeader';
import ProjectItem from './components/projectItem';
import EmptyView from './components/projectsEmptyView';
import { createAddProjectSteps } from './constant';
import { Container, ContentContainer, HeaderContainer } from './styles';

const Projects = () => {
  const isIndexer = useIsIndexer();
  const { setPageLoading } = useLoading();
  const [addProject, { loading }] = useMutation(ADD_PROJECT);
  const [getProjectList, { data }] = useLazyQuery(GET_PROJECTS, { fetchPolicy: 'network-only' });
  const { projectDetailList } = useProjectDetailList(data);

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setPageLoading(isUndefined(projectDetailList));
  }, [projectDetailList]);

  useEffect(() => {
    setPageLoading(true);
    getProjectList();
  }, []);

  const onModalClose = () => {
    setVisible(false);
  };

  const step = createAddProjectSteps(async (values, helper) => {
    try {
      const id = values[ProjectFormKey.deploymentId];
      await addProject({ variables: { id } });

      setVisible(false);
      getProjectList();
    } catch (_) {
      helper.setErrors({ [ProjectFormKey.deploymentId]: 'Invalid deployment id' });
    }
  });

  const renderProjects = () => {
    if (isUndefined(projectDetailList)) return null;
    return !isEmpty(projectDetailList) ? (
      <ContentContainer>
        <HeaderContainer>
          <Text size={45}>Projects</Text>
          <Button title="Add Project" onClick={() => setVisible(true)} />
        </HeaderContainer>
        <ProjecItemsHeader />
        {projectDetailList.map((props: ProjectDetails) => (
          <ProjectItem key={props.id} {...props} />
        ))}
      </ContentContainer>
    ) : (
      <EmptyView onClick={() => setVisible(true)} />
    );
  };

  return (
    <Container>
      {isIndexer && renderProjects()}
      <ModalView
        visible={visible}
        // @ts-ignore
        title={step.addProject[0].title}
        onClose={onModalClose}
        // @ts-ignore
        steps={step.addProject}
        currentStep={0}
        type={ProjectsAction.addProject}
        loading={loading}
      />
    </Container>
  );
};

export default Projects;
