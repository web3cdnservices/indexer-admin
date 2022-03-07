// Copyright 2020-2022 SubQuery Pte Ltd authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { FC } from 'react';
import { Tag } from '@subql/react-ui';
import styled from 'styled-components';

import { Separator, Text } from 'components/primary';

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
  min-width: 450px;
`;

const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
`;

type CardProps = {
  name: string;
} & TService;

const ServiceCard: FC<CardProps> = ({ name, status, url, imageVersion }) => (
  <CardContaineer>
    <HeaderContainer>
      <Text mr={20} fw="500">
        {name}
      </Text>
      <Tag text={status} state={status === 'Healthy' ? 'success' : 'error'} />
    </HeaderContainer>
    <Text size={15} color="gray" mt={10}>{`Endpoint: ${url}`}</Text>
    <Text size={15} color="gray" mt={10}>{`Image Version: ${imageVersion}`}</Text>
  </CardContaineer>
);

type Props = {
  indexerService?: TService;
  queryService?: TService;
};

const ProjectServiceCard: FC<Props> = ({ indexerService, queryService }) => {
  if (!indexerService && !queryService) {
    return null;
  }

  return (
    <Container>
      {!!indexerService && <ServiceCard name="Indexer Service" {...indexerService} />}
      {!!indexerService && !!queryService && <Separator mr={80} height={100} />}
      {!!queryService && <ServiceCard name="Query Service" {...queryService} />}
    </Container>
  );
};

export default ProjectServiceCard;
