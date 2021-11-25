// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import ProjectDetailsHeader from './components/projectDetailHeader';
import ProgressInfoView from './components/progressInfoView';
import ProjectServiceCard from './components/projectServiceCard';
import { Container } from './styles';
import ProjectDetailsView from './components/projectDetailsView';

const ProjectDetailsPage = () => {
  return (
    <Container>
      <ProjectDetailsHeader />
      <ProgressInfoView />
      <ProjectServiceCard />
      <ProjectDetailsView />
    </Container>
  );
};

export default ProjectDetailsPage;
