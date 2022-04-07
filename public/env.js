// Copyright 2020-2022 SubQuery Pte Ltd authors & contributors
// SPDX-License-Identifier: Apache-2.0

window.env = {
  // This option can be retrieved in "src/index.js" with "window.env.API_URL".
  NETWORK: 'testnet', // local | mainnet | testnet
  COORDINATOR_SERVICE_PORT: 8000,
  COORDINATOR_SERVICE_URL:
    'http://ec2-3-25-83-26.ap-southeast-2.compute.amazonaws.com:8000/graphql',
  IPFS_GATEWAY: 'https://ipfs.thechainhub.com/api/v0',
  REGISTRY_PROJECT: 'https://api.subquery.network/sq/subquery/subquery-network-query-registry',
};
