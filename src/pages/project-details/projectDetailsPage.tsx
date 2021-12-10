// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useLazyQuery } from '@apollo/client';
import { useLoading } from 'containers/loadingContext';
import { get } from 'lodash';

import { useIsIndexer } from 'hooks/indexerHook';
import { useProjectMetadata } from 'hooks/projectHook';
import { createApolloClient } from 'utils/apolloClient';
import { bytes32ToCid } from 'utils/ipfs';
import { calculateProgress, healthStatus } from 'utils/project';
import { GET_PROJECT, GET_QUERY_METADATA } from 'utils/queries';

import ProgressInfoView from './components/progressInfoView';
import ProjectDetailsHeader from './components/projectDetailHeader';
import ProjectDetailsView from './components/projectDetailsView';
import ProjectServiceCard from './components/projectServiceCard';
import { createServiceItem } from './constant';
import { Container, ContentContainer } from './styles';
import { TProjectMetadata, TQueryMetadata, TService } from './types';

// TODO: 1. can use the existing `query regiter` query service to get the project info: { name | owner | version }
// TODO: 2. request coordinator service to get the `node` and `indexer` service metadata -> health | endpoint | version
const ProjectDetailsPage = () => {
  const { id } = useParams() as { id: string };
  const isIndexer = useIsIndexer();
  const projectInfo = useProjectMetadata(bytes32ToCid(id));
  const { setPageLoading } = useLoading();
  const [getProject, { data, loading }] = useLazyQuery(GET_PROJECT, {
    fetchPolicy: 'network-only',
  });

  const [indexerSerive, setIndexerService] = useState<TService | undefined>(undefined);
  const [querySerive, setQueryService] = useState<TService | undefined>(undefined);
  const [projectMeta, setProjectMeta] = useState<TProjectMetadata | undefined>(undefined);
  const [progress, setProgress] = useState(0);

  const updateServicesInfo = (data: any) => {
    const metadata = get(data, '_metadata', null) as TQueryMetadata;
    if (metadata && projectMeta) {
      const {
        queryNodeVersion,
        indexerNodeVersion,
        lastProcessedHeight,
        targetHeight,
        indexerHealthy,
      } = metadata;
      setProgress(calculateProgress(targetHeight, lastProcessedHeight));
      setQueryService(
        createServiceItem(projectMeta.queryEndpoint, queryNodeVersion, healthStatus(true))
      );
      setIndexerService(
        createServiceItem(
          projectMeta?.indexerEndpoint,
          indexerNodeVersion,
          healthStatus(indexerHealthy)
        )
      );
    }
  };

  // TODO: reorganised these status
  useEffect(() => {
    // setPageLoading(isUndefined(projectInfo) || isUndefined(projectMeta));
  }, [projectInfo, projectMeta]);

  useEffect(() => {
    getProject({ variables: { id } });
  }, []);

  useEffect(() => {
    if (data?.project) {
      setProjectMeta(data.project);
    }
  }, [data]);

  useEffect(() => {
    const endpoint = projectMeta?.queryEndpoint;
    if (endpoint) {
      createApolloClient(`${endpoint}/graphql`)
        .query({ query: GET_QUERY_METADATA })
        .then(({ data }) => updateServicesInfo(data));
    }
  }, [projectMeta?.queryEndpoint]);

  const displayProejct = useCallback(() => {
    return isIndexer && !loading && !!data && data.project;
  }, [loading, data]);

  return (
    <Container>
      {displayProejct() && (
        <ContentContainer>
          <ProjectDetailsHeader id={id} project={projectInfo} />
          <ProgressInfoView percent={progress} />
          <ProjectServiceCard indexerService={indexerSerive} queryService={querySerive} />
          {projectInfo && <ProjectDetailsView id={id} project={projectInfo} />}
        </ContentContainer>
      )}
    </Container>
  );
};

export default ProjectDetailsPage;
