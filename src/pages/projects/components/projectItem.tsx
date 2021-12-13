// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { FC } from 'react';
import { useHistory } from 'react-router-dom';
import { Progress } from 'antd';
import styled from 'styled-components';

import Avatar from 'components/avatar';
import { Text } from 'components/primary';
import StatusLabel from 'components/statusLabel';
import { ProjectDetails, useIndexingStatus } from 'hooks/projectHook';
import { cidToBytes32 } from 'utils/ipfs';

import { statusColor, statusText } from '../constant';
import { ItemContainer } from '../styles';

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

type Props = ProjectDetails;

const ProjectItem: FC<Props> = (props) => {
  const history = useHistory();
  const { id, name } = props;
  const status = useIndexingStatus(id);
  return (
    <Container onClick={() => history.push(`/project/${id}`, { data: props })}>
      <ItemContainer pl={15} flex={7}>
        <Avatar address={cidToBytes32(id)} size={70} />
        <ProfileContainer>
          <Text fw="600" size={18}>
            {name}
          </Text>
          <Text size={13} mt={5}>
            {id}
          </Text>
        </ProfileContainer>
      </ItemContainer>
      <ItemContainer flex={5}>
        <ProgressBar percent={0} />
      </ItemContainer>
      <ItemContainer flex={1}>
        <StatusLabel text={statusText[status]} color={statusColor[status]} />
      </ItemContainer>
    </Container>
  );
};

export default ProjectItem;
