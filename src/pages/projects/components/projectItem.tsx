// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';
import { Hashicon } from '@emeraldpay/hashicon-react';
import { Progress } from 'antd';
import { FC } from 'react';
import StatusLabel from '../../../components/statusLabel';
import { IndexingStatus, statusColor, statusText } from '../constant';
import { Text } from '../../../components/primary';
import { ItemContainer } from '../styles';

const Container = styled.div`
  display: flex;
  width: 100%;
  min-width: 600px;
  min-height: 90px;
  margin: 10px 0px;
  padding: 10px 0px;
  background-color: white;
`;

const ProfileContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 80%;
  margin-left: 20px;
`;

const ProgressBar = styled(Progress)`
  width: 50%;
  min-width: 300;
  margin-right: 20px;
`;

type Props = {
  id: string;
  title: string;
  progress: number;
  status: IndexingStatus;
};

const ProjectItem: FC<Props> = ({ id, title, progress, status }) => {
  return (
    <Container>
      <ItemContainer pl={15} flex={4}>
        <Hashicon hasher="keccak" value={id} size={70} />
        <ProfileContainer>
          <Text fw="600" size={18}>
            {title}
          </Text>
          <Text mt={10}>{id}</Text>
        </ProfileContainer>
      </ItemContainer>
      <ItemContainer flex={3}>
        <ProgressBar percent={progress} />
      </ItemContainer>
      <ItemContainer flex={1}>
        <StatusLabel text={statusText[status]} color={statusColor[status]} />
      </ItemContainer>
    </Container>
  );
};

export default ProjectItem;
