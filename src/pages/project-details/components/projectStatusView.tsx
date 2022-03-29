// Copyright 2020-2022 SubQuery Pte Ltd authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { FC } from 'react';
import { Spinner } from '@subql/react-ui';
import { isUndefined } from 'lodash';
import styled from 'styled-components';

import { Text } from 'components/primary';
import StatusLabel from 'components/statusLabel';
import { TagItem } from 'components/tagItem';
import { IndexingStatus, statusColor, statusText } from 'pages/projects/constant';

import { TQueryMetadata } from '../types';

const Container = styled.div<{ mb?: number }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-width: 230px;
  margin-bottom: ${({ mb }) => mb ?? 0}px;
`;

const LabelContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

type Props = {
  status?: IndexingStatus;
  metadata?: TQueryMetadata;
};

const ProjectStatusView: FC<Props> = ({ status, metadata }) => (
  <Container mb={20}>
    <LabelContainer>
      <Text size={15} fw="500" mb={10}>
        Indexing Status
      </Text>
      {!isUndefined(status) ? (
        <StatusLabel text={statusText[status]} color={statusColor[status]} />
      ) : (
        <Spinner />
      )}
    </LabelContainer>
    {!!metadata?.targetHeight && (
      <Container>
        <TagItem versionType="Latest Block" prefix="#" value={metadata.targetHeight} />
        <TagItem versionType="Indexing Block" prefix="#" value={metadata.lastProcessedHeight} />
      </Container>
    )}
  </Container>
);

export default ProjectStatusView;
