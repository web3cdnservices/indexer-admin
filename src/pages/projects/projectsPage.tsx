// Copyright 2020-2022 SubQuery Pte Ltd authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { renderAsync, useAsyncMemo } from '@subql/react-hooks';
import { isEmpty } from 'lodash';

import { LoadingSpinner } from 'components/loading';
import { PopupView } from 'components/popupView';
import { Button, Text } from 'components/primary';
import { useIsIndexer } from 'hooks/indexerHook';
import {
  combineProjects,
  getIndexingProjects,
  getProjectDetails,
  getQueryMetadata,
  ProjectDetails,
} from 'hooks/projectHook';
import { useWeb3 } from 'hooks/web3Hook';
import { ProjectsAction, ProjectServiceMetadata } from 'pages/project-details/types';
import { ProjectFormKey } from 'types/schemas';
import { ADD_PROJECT, GET_PROJECTS } from 'utils/queries';

import ProjecItemsHeader from './components/projecItemsHeader';
import ProjectItem from './components/projectItem';
import EmptyView from './components/projectsEmptyView';
import { createAddProjectSteps } from './constant';
import { Container, ContentContainer, HeaderContainer } from './styles';

async function getProjectDetailList(
  account: string | null | undefined,
  data: { getProjects: ProjectDetails[] }
): Promise<ProjectDetails[] | undefined> {
  const localProjects = data?.getProjects as ProjectServiceMetadata[];

  const indexingProjects = await getIndexingProjects(account ?? '');
  const projects = combineProjects(localProjects, indexingProjects);

  const result = await Promise.all(
    projects.map(({ id }) => Promise.all([getProjectDetails(id), getQueryMetadata(id)]))
  );

  return result.map(([detail, metadata]) => ({ ...detail, metadata })).filter(({ id }) => !!id);
}

const Projects = () => {
  const isIndexer = useIsIndexer();
  const [addProject, { loading: addProjectLoading }] = useMutation(ADD_PROJECT);
  const {
    data: projects,
    refetch,
    loading: projectsLoading,
  } = useQuery(GET_PROJECTS, { fetchPolicy: 'network-only' });
  const { account } = useWeb3();

  const projectDetailsList = useAsyncMemo(async () => {
    if (!projectsLoading) {
      return getProjectDetailList(account, projects);
    }
    return undefined;
  }, [projects, account, projectsLoading]);

  const [visible, setVisible] = useState(false);

  const onModalClose = () => {
    setVisible(false);
  };

  const step = createAddProjectSteps(async (values, helper) => {
    try {
      // TODO: need to verify the id with subql-common library
      const id = values[ProjectFormKey.deploymentId].trim();
      await addProject({ variables: { id } });
      await refetch();
      setVisible(false);
    } catch (_) {
      helper.setErrors({ [ProjectFormKey.deploymentId]: 'Invalid deployment id' });
    }
  });

  const renderProjects = (projectDetailList: ProjectDetails[]) => {
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

  if (projectsLoading) return <LoadingSpinner />;

  return renderAsync(projectDetailsList, {
    loading: () => <LoadingSpinner />,
    error: () => <>Getting Project Details failed</>,
    data: (projectDetailList) => (
      <Container>
        {isIndexer && renderProjects(projectDetailList)}
        <PopupView
          setVisible={setVisible}
          visible={visible}
          // @ts-ignore
          title={step.addProject[0].title}
          onClose={onModalClose}
          // @ts-ignore
          steps={step.addProject}
          currentStep={0}
          type={ProjectsAction.addProject}
          loading={addProjectLoading}
        />
      </Container>
    ),
  });
};

export default Projects;
