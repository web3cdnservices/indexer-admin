// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';

export function createApolloClient(uri: string) {
  return new ApolloClient({
    link: new HttpLink({ uri }),
    cache: new InMemoryCache(),
  });
}
