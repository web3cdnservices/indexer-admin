// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';

// FIXME: save encrypted uri in local
const uriKey = 'testUriKey';

export function saveClientUri(uri: string) {
  localStorage.setItem(uriKey, uri);
}

export function getClientUri(): string {
  return localStorage.getItem(uriKey) ?? '';
}

export function createApolloClient(uri?: string) {
  return new ApolloClient({
    link: new HttpLink({ uri: uri ?? getClientUri() }),
    cache: new InMemoryCache(),
  });
}
