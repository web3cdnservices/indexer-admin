// Copyright 2020-2022 SubQuery Pte Ltd authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ApolloClient, InMemoryCache } from '@apollo/client';

const defaultCoordinatorUrl = `${window.location.protocol}//${window.location.hostname}:${window.env.COORDINATOR_SERVICE_PORT}/graphql`;

export const coordinatorServiceUrl = __DEV__
  ? window.env.COORDINATOR_SERVICE_URL
  : defaultCoordinatorUrl;

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
