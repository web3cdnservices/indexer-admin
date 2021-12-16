// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { FC } from 'react';
import styled from 'styled-components';

import IntroductionView from 'components/introductionView';

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

const EmptyView: FC<Props> = ({ onClick }) => {
  return (
    <Container>
      <IntroductionView
        item={{
          title: 'Start to index a Subquery project',
          desc: 'Go to Subquery Explorer to start exploring query projects, pick the project you are interesting and copy the deployment id in the page, then press the add project button and paste in deployment id, add the project into you coordinator service, and you can manage the projects at any time. ',
          buttonTitle: 'Add Project',
        }}
        onClick={onClick}
      />
    </Container>
  );
};

export default EmptyView;
