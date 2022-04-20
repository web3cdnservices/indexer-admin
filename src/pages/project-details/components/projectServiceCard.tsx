// Copyright 2020-2022 SubQuery Pte Ltd authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { FC } from 'react';
import { Tag } from '@subql/react-ui';
import styled from 'styled-components';

import { Button, Text } from 'components/primary';
import { proxyServiceUrl } from 'utils/apolloClient';
import { statusCode } from 'utils/project';

import { ButtonItem } from '../config';
import { ActionContainer, CardContainer } from '../styles';
import { TQueryMetadata } from '../types';

const ContentContainer = styled.div`
  display: flex;
  background-color: white;
  border-radius: 8px;
`;

const ServiceContaineer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 200px;
  margin-right: 30px;
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

const ServiceView: FC<CardProps> = ({ title, subTitle, status }) => (
  <ServiceContaineer>
    <HeaderContainer>
      <Text mr={20} fw="500">
        {title}
      </Text>
      {!!status && <Tag text={status} state={statusCode(status)} />}
    </HeaderContainer>
    <Text size={15} color="gray" mt={10}>
      {subTitle}
    </Text>
  </ServiceContaineer>
);

type Props = {
  id: string;
  actionItems: ButtonItem[];
  data?: TQueryMetadata;
};

const ProjectServiceCard: FC<Props> = ({ id, actionItems, data }) => {
  if (!data) return null;

  const imageVersion = (type: string, version: string) => `onfinality/subql-${type}:${version}`;

  return (
    <CardContainer>
      <ContentContainer>
        <ServiceView
          title="Indexer Service"
          subTitle={`Image Version: ${imageVersion('indexer', data.indexerNodeVersion)}`}
          status={data.indexerStatus}
        />
        <ServiceView
          title="Query Service"
          subTitle={`Image Version: ${imageVersion('query', data.queryNodeVersion)}`}
          status={data.queryStatus}
        />
        <ServiceView
          title="Proxy Service"
          subTitle={`Url: ${proxyServiceUrl}/query/${id}`}
          status={data.queryStatus}
        />
      </ContentContainer>
      <ActionContainer>
        {actionItems.map(({ title, action }) => (
          <Button mt={10} key={title} width={265} title={title} onClick={action} />
        ))}
      </ActionContainer>
    </CardContainer>
  );
};

export default ProjectServiceCard;
