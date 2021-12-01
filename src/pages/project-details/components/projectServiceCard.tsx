// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { FC, useEffect, useState } from 'react';
import styled from 'styled-components';
import StatusLabel from '../../../components/statusLabel';
import { Separator, Text } from '../../../components/primary';
import { TQueryMetadata, TService } from '../types';
import { createApolloClient } from '../../../utils/apolloClient';
import { GET_QUERY_METADATA } from '../../../utils/queries';

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

const ServiceCard: FC<TService> = ({ name, status, url, imageVersion }) => (
  <CardContaineer>
    <HeaderContainer>
      <Text mr={20} fw="500">
        {name}
      </Text>
      <StatusLabel text={status} />
    </HeaderContainer>
    <Text size={15} color="gray" mt={10}>{`Endpoint: ${url}`}</Text>
    <Text size={15} color="gray" mt={10}>{`Image Version: ${imageVersion}`}</Text>
  </CardContaineer>
);

type Props = {
  indexerEndpoint?: string;
  queryEndpoint?: string;
};

const ProjectServiceCard: FC<Props> = ({ indexerEndpoint, queryEndpoint }) => {
  const [indexerSerive, setIndexerService] = useState<TService | undefined>(undefined);
  const [querySerive, setQueryService] = useState<TService | undefined>(undefined);

  useEffect(() => {
    if (indexerEndpoint) {
      // FIXME: need to have a valid indexer endpoint to have a test
      fetch(`${indexerEndpoint}/meta`).then((response) => {
        console.log(response);
      });
    }
  }, [indexerEndpoint]);

  useEffect(() => {
    if (queryEndpoint) {
      createApolloClient(`${queryEndpoint}/graphql`)
        .query({ query: GET_QUERY_METADATA })
        .then((data) => {
          // eslint-disable-next-line dot-notation
          const { queryNodeVersion } = data.data['_metadata'] as TQueryMetadata;
          setQueryService({
            url: queryEndpoint,
            imageVersion: `onfinality/subql-node:${queryNodeVersion}`,
            status: 'Healthy',
            name: 'Query Service',
          });
        });
    }
  }, [queryEndpoint]);

  if (!indexerSerive && !querySerive) {
    return null;
  }

  return (
    <Container>
      {!!indexerSerive && <ServiceCard {...indexerSerive} />}
      {!!indexerSerive && !!querySerive && <Separator mr={80} height={100} />}
      {!!querySerive && <ServiceCard {...querySerive} />}
    </Container>
  );
};

export default ProjectServiceCard;
