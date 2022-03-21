// Copyright 2020-2022 SubQuery Pte Ltd authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useCallback, useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useLazyQuery } from '@apollo/client';
import { isUndefined } from 'lodash';

import { useLoading } from 'containers/loadingContext';
import {
  ProjectDetails,
  useIndexingStatus,
  useProjectDetails,
  useProjectService,
} from 'hooks/projectHook';
import { useRouter } from 'hooks/routerHook';
import { calculateProgress, serviceStatus } from 'utils/project';
import { GET_QUERY_METADATA } from 'utils/queries';

import ProgressInfoView from './components/progressInfoView';
import ProjectDetailsHeader from './components/projectDetailHeader';
import ProjectServiceCard from './components/projectServiceCard';
import ProjectStatusView from './components/projectStatusView';
import ProjectTabbarView from './components/projectTabBarView';
import { createServiceItem } from './config';
import { Container, ContentContainer } from './styles';
import { TQueryMetadata, TService } from './types';

const ProjectDetailsPage = () => {
  const { id } = useParams() as { id: string };
  const { data: projectDetails } = useLocation().state as { data: ProjectDetails };
  const [queryMetadata] = useLazyQuery(GET_QUERY_METADATA);
  const status = useIndexingStatus(id);
  const projectInfo = useProjectDetails(id);
  const projectService = useProjectService(id);
  const { setPageLoading } = useLoading();
  useRouter(!projectDetails);

  const [indexerSerive, setIndexerService] = useState<TService>();
  const [querySerive, setQueryService] = useState<TService>();
  const [progress, setProgress] = useState(0);
  const [metadata, setMetadata] = useState<TQueryMetadata>();

  const updateServicesInfo = (queryMetadata: TQueryMetadata) => {
    if (queryMetadata && projectService) {
      const {
        queryNodeVersion,
        indexerNodeVersion,
        lastProcessedHeight,
        targetHeight,
        indexerHealthy,
      } = queryMetadata;
      setMetadata(queryMetadata);
      setProgress(calculateProgress(targetHeight, lastProcessedHeight));
      setQueryService(
        createServiceItem(
          'query',
          projectService.queryEndpoint,
          queryNodeVersion,
          serviceStatus(indexerHealthy)
        )
      );
      setIndexerService(
        createServiceItem(
          'node',
          projectService?.nodeEndpoint,
          indexerNodeVersion,
          serviceStatus(indexerHealthy)
        )
      );
    }
  };

  const getMetadata = useCallback(async () => {
    () => {
      if (!projectService?.id) return;
      const result = queryMetadata({ variables: { id: projectService.id } });
      // @ts-ignore
      updateServicesInfo(result.queryMetadata);
    };
  }, [projectService?.id]);

  useEffect(() => {
    setPageLoading(isUndefined(projectInfo));
  }, [projectInfo]);

  useEffect(() => {
    getMetadata();
  }, [projectService?.queryEndpoint, status]);

  return (
    <Container>
      {projectInfo && (
        <ContentContainer>
          <ProjectDetailsHeader
            id={id}
            status={status}
            project={projectInfo}
            service={querySerive}
            stateChanged={() => getMetadata()}
          />
          <ProjectStatusView status={status} metadata={metadata} />
          <ProgressInfoView percent={progress} />
          <ProjectServiceCard id={id} indexerService={indexerSerive} queryService={querySerive} />
          <ProjectTabbarView id={id} project={projectInfo} />
        </ContentContainer>
      )}
    </Container>
  );
};

export default ProjectDetailsPage;
