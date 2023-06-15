// Copyright 2020-2022 SubQuery Pte Ltd authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ApolloClient, gql, InMemoryCache } from '@apollo/client';

const defaultCoordinatorUrl = `${window.location.protocol}//${window.location.hostname}:${window.env.COORDINATOR_SERVICE_PORT}/graphql`;

export const coordinatorServiceUrl =
  process.env.NODE_ENV !== 'production'
    ? window.env.COORDINATOR_SERVICE_URL
    : defaultCoordinatorUrl;

export const excellencyServiceUrl =
  process.env.NODE_ENV === 'development'
    ? 'https://leaderboard-api.thechaindata.com/graphql'
    : 'https://leaderboard-api.subquery.network/graphql';

export const proxyServiceUrl = `${window.location.protocol}//${window.location.hostname}`;

export function createApolloClient(uri: string) {
  return new ApolloClient({
    uri,
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'network-only',
      },
    },
  });
}

// TODO: update report
const excellencyClient = createApolloClient(excellencyServiceUrl);

export const excellencyQuery = async <T = any>(
  query: string
): Promise<{ data: T; status: number }> => {
  const { data, networkStatus } = await excellencyClient.query({
    query: gql`
      ${query}
    `,
  });

  return {
    data,
    status: networkStatus,
  };
};
