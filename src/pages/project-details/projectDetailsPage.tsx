// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import ProjectDetailsHeader from './components/projectDetailHeader';
import ProgressInfoView from './components/progressInfoView';
import ProjectServiceCard from './components/projectServiceCard';
import { Container } from './styles';
import ProjectDetailsView from './components/projectDetailsView';
import { indexerServiceItem, queryServiceItem } from './mock';

// TODO: 1. can use the existing `query regiter` query service to get the project info: { name | owner | version }
// TODO: 2. request coordinator service to get the `node` and `indexer` service metadata -> health | endpoint | version
const ProjectDetailsPage = () => {
  return (
    <Container>
      <ProjectDetailsHeader />
      <ProgressInfoView percent={80} />
      <ProjectServiceCard indexerService={indexerServiceItem} queryService={queryServiceItem} />
      <ProjectDetailsView />
    </Container>
  );
};

export default ProjectDetailsPage;
