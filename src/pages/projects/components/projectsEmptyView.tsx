// Copyright 2020-2022 SubQuery Pte Ltd authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { FC } from 'react';
import styled from 'styled-components';

import IntroductionView from 'components/introductionView';
import { SUPPORTED_NETWORK_PROJECTS_EXPLORER } from 'utils/web3';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: flex-start;
  margin-top: 80px;
`;

type Props = {
  onClick: () => void;
};

const ExplorerLink = () => (
  <a target="_blank" href={SUPPORTED_NETWORK_PROJECTS_EXPLORER} rel="noreferrer">
    SubQuery Explorer
  </a>
);

const EmptyView: FC<Props> = ({ onClick }) => {
  return (
    <Container>
      <IntroductionView
        item={{
          title: 'Start to index a Subquery project',
          desc: 'Go to Subquery Explorer to start exploring query projects, pick the project you are interesting and copy the deployment id in the page, then press the add project button and paste in deployment id, add the project into you coordinator service, and you can manage the projects in indexer app. ',
          buttonTitle: 'Add Project',
        }}
        onClick={onClick}
        link={ExplorerLink()}
      />
    </Container>
  );
};

export default EmptyView;
