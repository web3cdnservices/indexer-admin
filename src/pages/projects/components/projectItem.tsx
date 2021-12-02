// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';
import { Hashicon } from '@emeraldpay/hashicon-react';
import { Progress } from 'antd';
import { FC } from 'react';
import { useHistory } from 'react-router-dom';
import StatusLabel from '../../../components/statusLabel';
import { statusColor, statusText } from '../constant';
import { Text } from '../../../components/primary';
import { ItemContainer } from '../styles';
import { useIndexingStatus } from '../../../hooks/projectHook';

const Container = styled.div`
  display: flex;
  width: 100%;
  min-width: 600px;
  min-height: 90px;
  margin: 10px 0px;
  padding: 10px 10px;
  background-color: white;
  :hover {
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    cursor: pointer;
  }
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
};

const ProjectItem: FC<Props> = ({ id, title, progress = 0 }) => {
  const history = useHistory();
  const status = useIndexingStatus(id);
  return (
    <Container onClick={() => history.push(`/project/${id}`)}>
      <ItemContainer pl={15} flex={7}>
        <Hashicon hasher="keccak" value={id} size={70} />
        <ProfileContainer>
          <Text fw="600" size={18}>
            {title ?? 'Sushi Swap'}
          </Text>
          <Text size={13} mt={5}>
            {id}
          </Text>
        </ProfileContainer>
      </ItemContainer>
      <ItemContainer flex={5}>
        <ProgressBar percent={progress} />
      </ItemContainer>
      <ItemContainer flex={1}>
        <StatusLabel text={statusText[status]} color={statusColor[status]} />
      </ItemContainer>
    </Container>
  );
};

export default ProjectItem;
