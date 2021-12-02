// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useParams } from 'react-router-dom';
import { useLazyQuery } from '@apollo/client';
import { useState, useEffect, useCallback } from 'react';
import { get } from 'lodash';
import ProjectDetailsHeader from './components/projectDetailHeader';
import ProgressInfoView from './components/progressInfoView';
import { createApolloClient } from '../../utils/apolloClient';
import { GET_QUERY_METADATA, GET_PROJECT } from '../../utils/queries';
import ProjectServiceCard from './components/projectServiceCard';
import { Container, ContentContainer } from './styles';
import ProjectDetailsView from './components/projectDetailsView';
import Loading from '../../components/loading';
import { useDefaultLoading } from '../../hooks/projectHook';
import { TProjectMetadata, TQueryMetadata, TService } from './types';
import { calculateProgress, healthStatus } from '../../utils/project';
import { createServiceItem } from './constant';
import { useIsIndexer } from '../../hooks/indexerHook';

// TODO: 1. can use the existing `query regiter` query service to get the project info: { name | owner | version }
// TODO: 2. request coordinator service to get the `node` and `indexer` service metadata -> health | endpoint | version
const ProjectDetailsPage = () => {
  const { id } = useParams() as { id: string };
  const isIndexer = useIsIndexer();
  const defaultLoading = useDefaultLoading();
  // TODO: code gen -> schema -> get response type
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

  useEffect(() => getProject({ variables: { id } }), []);

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
    return isIndexer && !defaultLoading && !loading && !!data && data.project;
  }, [loading, data, defaultLoading]);

  return (
    <Container>
      {displayProejct() && (
        <ContentContainer>
          <ProjectDetailsHeader id={id} />
          <ProgressInfoView percent={progress} />
          <ProjectServiceCard indexerService={indexerSerive} queryService={querySerive} />
          <ProjectDetailsView id={id} />
        </ContentContainer>
      )}
      {(loading || defaultLoading) && <Loading />}
    </Container>
  );
};

export default ProjectDetailsPage;
