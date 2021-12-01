// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useParams } from 'react-router-dom';
import { useLazyQuery } from '@apollo/client';
import { useEffect, useCallback } from 'react';
import ProjectDetailsHeader from './components/projectDetailHeader';
import ProgressInfoView from './components/progressInfoView';
import ProjectServiceCard from './components/projectServiceCard';
import { Container, ContentContainer } from './styles';
import ProjectDetailsView from './components/projectDetailsView';
import { GET_PROJECT } from '../../utils/queries';
import Loading from '../../components/loading';
import { useDefaultLoading } from '../../hooks/projectHook';

// TODO: 1. can use the existing `query regiter` query service to get the project info: { name | owner | version }
// TODO: 2. request coordinator service to get the `node` and `indexer` service metadata -> health | endpoint | version
const ProjectDetailsPage = () => {
  const { id } = useParams() as { id: string };
  const defaultLoading = useDefaultLoading();
  // TODO: code gen -> schema -> get response type
  const [getProject, { data, loading }] = useLazyQuery(GET_PROJECT, {
    fetchPolicy: 'network-only',
  });

  useEffect(() => getProject({ variables: { id } }), []);

  const displayProejct = useCallback(() => {
    return !defaultLoading && !loading && !!data && data.project;
  }, [loading, data, defaultLoading]);

  // FIXME: this is not elegant
  const getItem = useCallback(() => {
    return data.project;
  }, [data]);

  return (
    <Container>
      {displayProejct() && (
        <ContentContainer>
          <ProjectDetailsHeader id={id} />
          <ProgressInfoView percent={0} />
          <ProjectServiceCard
            indexerEndpoint={getItem().indexerEndpoint}
            queryEndpoint={getItem().queryEndpoint}
          />
          <ProjectDetailsView id={id} />
        </ContentContainer>
      )}
      {(loading || defaultLoading) && <Loading />}
    </Container>
  );
};

export default ProjectDetailsPage;
