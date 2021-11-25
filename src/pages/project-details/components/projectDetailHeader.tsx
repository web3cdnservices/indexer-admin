// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';
import { Hashicon } from '@emeraldpay/hashicon-react';
import { useLocation } from 'react-router-dom';
import { Button, Text } from '../../../components/primary';
import { buttonItems } from '../constant';
import { TProject } from '../types';

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  min-height: 200px;
`;

const LeftContainer = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  min-width: 685px;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  margin-left: 40px;
`;

const VersionContainer = styled.div`
  height: 50px;
  background-color: lightgray;
  margin-top: 20px;
`;

const ActionContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const ProjectDetailsHeader = () => {
  const location = useLocation();
  // @ts-ignore
  const { id, name, status }: TProject = location?.state;
  // TODO: 1. only progress reach `100%` can display `publish to ready` button
  const actionItems = buttonItems[status];

  // TODO: 2. change `id` to project owner address other than use deploymentID
  // TODO: 3. `stop indexing` button should be red color

  return (
    <Container>
      <LeftContainer>
        <Hashicon hasher="keccak" value={id} size={150} />
        <ContentContainer>
          <Text fw="600" size={30}>
            {name}
          </Text>
          <Text fw="400" size={15}>
            {id}
          </Text>
          <VersionContainer />
        </ContentContainer>
      </LeftContainer>
      {!!actionItems && (
        <ActionContainer>
          {actionItems.map(({ title, action, color }) => (
            <Button
              margin={10}
              key={title}
              width={200}
              title={title}
              color={color}
              onClick={action}
            />
          ))}
        </ActionContainer>
      )}
    </Container>
  );
};

export default ProjectDetailsHeader;
