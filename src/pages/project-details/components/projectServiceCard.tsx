// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { FC } from 'react';
import styled from 'styled-components';
import StatusLabel from '../../../components/statusLabel';
import { Separator, Text } from '../../../components/primary';
import { TService } from '../types';

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: white;
  border-radius: 15px;
  padding: 10px 50px;
  margin-top: 30px;
  min-height: 150px;
`;

const CardContaineer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
`;

const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
`;

type Props = {
  indexerService?: TService;
  queryService?: TService;
};

const ServiceCard: FC<TService> = ({ name, status, url, imageVersion }) => (
  <CardContaineer>
    <HeaderContainer>
      <Text mr={20} fw="500">
        {name}
      </Text>
      <StatusLabel text={status} />
    </HeaderContainer>
    <Text color="gray" mt={10}>{`Endpoint: ${url}`}</Text>
    <Text color="gray" mt={10}>{`Image Version: ${imageVersion}`}</Text>
  </CardContaineer>
);

const ProjectServiceCard: FC<Props> = ({ indexerService, queryService }) => {
  return (
    <Container>
      {!!indexerService && <ServiceCard {...indexerService} />}
      {!!indexerService && !!indexerService && <Separator mr={80} height={100} />}
      {!!queryService && <ServiceCard {...queryService} />}
    </Container>
  );
};

export default ProjectServiceCard;
