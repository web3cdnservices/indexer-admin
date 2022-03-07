// Copyright 2020-2022 SubQuery Pte Ltd authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { FC } from 'react';
import { ProgressBar } from '@subql/react-ui';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  min-width: 350px;
  height: 40px;
`;

type Props = {
  percent: number;
};

const ProgressInfoView: FC<Props> = ({ percent }) => (
  <Container>
    <ProgressBar progress={percent / 100} />
  </Container>
);

export default ProgressInfoView;
