// Copyright 2020-2022 SubQuery Pte Ltd authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { FC } from 'react';
import { Tag } from '@subql/react-ui';
import styled from 'styled-components';

import { Text } from 'components/primary';
import { proxyServiceUrl } from 'utils/apolloClient';
import { statusCode } from 'utils/project';

import { TQueryMetadata } from '../types';

const Container = styled.div`
  display: flex;
  margin-top: 30px;
`;

const CardContaineer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-color: white;
  border-radius: 15px;
  padding: 0px 30px;
  margin-right: 30px;
  min-height: 130px;
  min-width: 200px;
`;

const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
`;

type CardProps = {
  title: string;
  subTitle: string;
  status?: string;
};

const ServiceCard: FC<CardProps> = ({ title, subTitle, status }) => (
  <CardContaineer>
    <HeaderContainer>
      <Text mr={20} fw="500">
        {title}
      </Text>
      {!!status && <Tag text={status} state={statusCode(status)} />}
    </HeaderContainer>
    <Text size={15} color="gray" mt={10}>
      {subTitle}
    </Text>
  </CardContaineer>
);

type Props = {
  id: string;
  data?: TQueryMetadata;
};

const ProjectServiceCard: FC<Props> = ({ id, data }) => {
  if (!data) return null;

  const imageVersion = (type: string, version: string) => `onfinality/subql-${type}:${version}`;

  return (
    <Container>
      <ServiceCard
        title="Indexer Service"
        subTitle={`Image Version: ${imageVersion('indexer', data.indexerNodeVersion)}`}
        status={data.indexerStatus}
      />
      <ServiceCard
        title="Query Service"
        subTitle={`Image Version: ${imageVersion('indexer', data.queryNodeVersion)}`}
        status={data.queryStatus}
      />
      <ServiceCard
        title="Proxy Service"
        subTitle={`Url: ${proxyServiceUrl}/query/${id}`}
        status={data.queryStatus}
      />
    </Container>
  );
};

export default ProjectServiceCard;
