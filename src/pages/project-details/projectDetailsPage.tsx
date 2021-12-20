// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { get, isUndefined } from 'lodash';

import { useLoading } from 'containers/loadingContext';
import {
  ProjectDetails,
  useIndexingStatus,
  useProjectDetails,
  useProjectService,
} from 'hooks/projectHook';
import { useRouter } from 'hooks/routerHook';
import { createApolloClient } from 'utils/apolloClient';
import { calculateProgress, healthStatus } from 'utils/project';
import { GET_QUERY_METADATA } from 'utils/queries';

import ProgressInfoView from './components/progressInfoView';
import ProjectDetailsHeader from './components/projectDetailHeader';
import ProjectDetailsView from './components/projectDetailsView';
import ProjectServiceCard from './components/projectServiceCard';
import ProjectStatusView from './components/projectStatusView';
import { createServiceItem } from './config';
import { Container, ContentContainer } from './styles';
import { TQueryMetadata, TService } from './types';

// TODO: 1. can use the existing `query regiter` query service to get the project info: { name | owner | version }
// TODO: 2. request coordinator service to get the `node` and `indexer` service metadata -> health | endpoint | version
const ProjectDetailsPage = () => {
  const { id } = useParams() as { id: string };
  const { data: projectDetails } = useLocation().state as { data: ProjectDetails };
  const status = useIndexingStatus(id);
  const projectInfo = useProjectDetails(projectDetails);
  const projectService = useProjectService(id);
  const { setPageLoading } = useLoading();
  useRouter();

  const [indexerSerive, setIndexerService] = useState<TService>();
  const [querySerive, setQueryService] = useState<TService>();
  const [progress, setProgress] = useState(0);
  const [queryMetadata, setQueryMeta] = useState<TQueryMetadata>();

  const updateServicesInfo = (data: any) => {
    const metadata = get(data, '_metadata', null) as TQueryMetadata;
    if (metadata && projectService) {
      const {
        queryNodeVersion,
        indexerNodeVersion,
        lastProcessedHeight,
        targetHeight,
        indexerHealthy,
      } = metadata;
      setQueryMeta(metadata);
      setProgress(calculateProgress(targetHeight, lastProcessedHeight));
      setQueryService(
        createServiceItem(projectService.queryEndpoint, queryNodeVersion, healthStatus(true))
      );
      setIndexerService(
        createServiceItem(
          projectService?.indexerEndpoint,
          indexerNodeVersion,
          healthStatus(indexerHealthy)
        )
      );
    }
  };

  useEffect(() => {
    setPageLoading(isUndefined(projectInfo));
  }, [projectInfo]);

  useEffect(() => {
    const endpoint = projectService?.queryEndpoint;
    if (endpoint) {
      createApolloClient(`${endpoint}/graphql`)
        .query({ query: GET_QUERY_METADATA })
        .then(({ data }) => updateServicesInfo(data));
    }
  }, [projectService?.queryEndpoint]);

  return (
    <Container>
      {projectInfo && (
        <ContentContainer>
          <ProjectDetailsHeader
            id={id}
            status={status}
            project={projectInfo}
            serviceConfiged={!!querySerive}
          />
          <ProjectStatusView status={status} metadata={queryMetadata} />
          <ProgressInfoView percent={progress} />
          <ProjectServiceCard indexerService={indexerSerive} queryService={querySerive} />
          <ProjectDetailsView id={id} project={projectInfo} />
        </ContentContainer>
      )}
    </Container>
  );
};

export default ProjectDetailsPage;
