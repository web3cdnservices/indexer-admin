// Copyright 2020-2022 SubQuery Pte Ltd authors & contributors
// SPDX-License-Identifier: Apache-2.0

window.env = {
  // This option can be retrieved in "src/index.js" with "window.env.API_URL".
  NETWORK: 'testnet', // local | mainnet | testnet
  // COORDINATOR_HOST: 'http://ec2-13-211-22-211.ap-southeast-2.compute.amazonaws.com',
  // COORDINATOR_GRAPHQL: 'http://13.211.22.211:8000/graphql',
  COORDINATOR_HOST: 'http://localhost',
  PROXY_SERVICE_URL: 'http://localhost:8001',
  COORDINATOR_GRAPHQL: 'http://localhost:8000/graphql',
  IPFS_GATEWAY: 'https://ipfs.thechainhub.com/api/v0',
  REGISTRY_PROJECT: 'https://api.subquery.network/sq/subquery/subquery-network-query-registry',
};
