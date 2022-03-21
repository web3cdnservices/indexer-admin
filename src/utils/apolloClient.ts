// Copyright 2020-2022 SubQuery Pte Ltd authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';

export const coordinatorServiceUrl = `${window.location.protocol}//${window.location.hostname}:${window.env.COORDINATOR_SERVICE_PORT}/graphql`;

export const proxyServiceUrl = `${window.location.protocol}//${window.location.hostname}`;

export function createApolloClient(uri: string) {
  return new ApolloClient({
    link: new HttpLink({ uri }),
    cache: new InMemoryCache(),
  });
}
