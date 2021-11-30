// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ApolloClient, InMemoryCache } from '@apollo/client';
import { useEffect, useState } from 'react';

export function useServiceUrl() {
  const [url, setUrl] = useState('http:localhost:3001');

  // FIXME: need to update url when login complete
  useEffect(() => setUrl(''), []);

  return url;
}

export function createClient(uri: string) {
  return new ApolloClient({ uri, cache: new InMemoryCache() });
}

export function useClient() {
  const uri = useServiceUrl();
  const [client, setClient] = useState(createClient(uri));

  useEffect(() => setClient(createClient(uri)), [uri]);

  return client;
}
