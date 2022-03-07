// Copyright 2020-2022 SubQuery Pte Ltd authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { FC } from 'react';
import styled from 'styled-components';

import StatusLabel from 'components/statusLabel';
import { IndexingStatus, statusColor, statusText } from 'pages/projects/constant';

import { TQueryMetadata } from '../types';
import { TagItem } from './projectDetailHeader';

const Container = styled.div<{ mb?: number }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-width: 230px;
  margin-bottom: ${({ mb }) => mb ?? 0}px;
`;

type Props = {
  status: IndexingStatus;
  metadata?: TQueryMetadata;
};

const ProjectStatusView: FC<Props> = ({ status, metadata }) => (
  <Container mb={20}>
    <StatusLabel text={statusText[status]} color={statusColor[status]} />
    {!!metadata?.targetHeight && (
      <Container>
        <TagItem versionType="Current Block" prefix="#" value={metadata.targetHeight} />
        <TagItem versionType="Latest Block" prefix="#" value={metadata.lastProcessedHeight} />
      </Container>
    )}
  </Container>
);

export default ProjectStatusView;
