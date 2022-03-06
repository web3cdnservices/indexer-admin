// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { isUndefined } from 'lodash';

import { useLoading } from 'containers/loadingContext';
import {
  getQueryMetadata,
  ProjectDetails,
  useIndexingStatus,
  useProjectDetails,
  useProjectService,
} from 'hooks/projectHook';
import { useRouter } from 'hooks/routerHook';
import { calculateProgress, healthStatus } from 'utils/project';

import ProgressInfoView from './components/progressInfoView';
import ProjectDetailsHeader from './components/projectDetailHeader';
import ProjectDetailsView from './components/projectDetailsView';
import ProjectServiceCard from './components/projectServiceCard';
import ProjectStatusView from './components/projectStatusView';
import { createServiceItem } from './config';
import { Container, ContentContainer } from './styles';
import { TQueryMetadata, TService } from './types';

const ProjectDetailsPage = () => {
  const { id } = useParams() as { id: string };
  const { data: projectDetails } = useLocation().state as { data: ProjectDetails };
  const status = useIndexingStatus(id);
  const projectInfo = useProjectDetails(projectDetails);
  const projectService = useProjectService(id);
  const { setPageLoading } = useLoading();
  useRouter(!projectDetails);

  const [indexerSerive, setIndexerService] = useState<TService>();
  const [querySerive, setQueryService] = useState<TService>();
  const [progress, setProgress] = useState(0);
  const [queryMetadata, setQueryMeta] = useState<TQueryMetadata>();

  const updateServicesInfo = (metadata: TQueryMetadata) => {
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
        createServiceItem(
          'query',
          projectService.queryEndpoint,
          queryNodeVersion,
          healthStatus(!!targetHeight)
        )
      );
      setIndexerService(
        createServiceItem(
          'node',
          projectService?.indexerEndpoint,
          indexerNodeVersion,
          healthStatus(indexerHealthy)
        )
      );
    }
  };

  const getMetadata = () => {
    const endpoint = projectService?.queryEndpoint;
    if (endpoint) {
      getQueryMetadata(endpoint).then(updateServicesInfo);
    }
  };

  useEffect(() => {
    setPageLoading(isUndefined(projectInfo));
  }, [projectInfo]);

  useEffect(getMetadata, [projectService?.queryEndpoint, status]);

  return (
    <Container>
      {projectInfo && (
        <ContentContainer>
          <ProjectDetailsHeader
            id={id}
            status={status}
            project={projectInfo}
            serviceConfiged={!!querySerive}
            updateState={() => getMetadata()}
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
