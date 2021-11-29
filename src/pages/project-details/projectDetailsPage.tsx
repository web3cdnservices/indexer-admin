// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useLocation } from 'react-router-dom';
import ProjectDetailsHeader from './components/projectDetailHeader';
import ProgressInfoView from './components/progressInfoView';
import ProjectServiceCard from './components/projectServiceCard';
import { Container } from './styles';
import ProjectDetailsView from './components/projectDetailsView';
import { indexerServiceItem, queryServiceItem } from './mock';
import { TProject } from '../projects/types';

// TODO: 1. can use the existing `query regiter` query service to get the project info: { name | owner | version }
// TODO: 2. request coordinator service to get the `node` and `indexer` service metadata -> health | endpoint | version
const ProjectDetailsPage = () => {
  const location = useLocation();
  // @ts-ignore
  const { queryEndpoint, indexEndpoint }: TProject = location?.state;

  return (
    <Container>
      <ProjectDetailsHeader />
      <ProgressInfoView percent={0} />
      {queryEndpoint ||
        (indexEndpoint && (
          <ProjectServiceCard
            indexerService={true ? indexerServiceItem : undefined}
            queryService={queryEndpoint ? queryServiceItem : undefined}
          />
        ))}
      <ProjectDetailsView />
    </Container>
  );
};

export default ProjectDetailsPage;
