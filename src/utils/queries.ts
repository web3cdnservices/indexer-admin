// Copyright 2020-2022 SubQuery Pte Ltd authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { gql } from '@apollo/client';

// TODO: use the public queries for `network-clients`

export type QueryResult = {
  loading?: boolean;
  data?: any;
  error?: Error;
};

export const GET_COORDINATOR_INDEXER = gql`
  query {
    accountMetadata {
      indexer
      network
    }
  }
`;

export const ADD_INDEXER = gql`
  mutation AddIndexer($indexer: String!) {
    addIndexer(address: $indexer) {
      address
    }
  }
`;

export const START_PROJECT = gql`
  mutation StartProject(
    $forceEnabled: Boolean!
    $queryVersion: String!
    $nodeVersion: String!
    $networkDictionary: String!
    $networkEndpoint: String!
    $id: String!
  ) {
    startProject(
      forceEnabled: $forceEnabled
      queryVersion: $queryVersion
      nodeVersion: $nodeVersion
      networkDictionary: $networkDictionary
      networkEndpoint: $networkEndpoint
      id: $id
    ) {
      id
      status
      networkEndpoint
      networkDictionary
      nodeVersion
      queryVersion
      nodeEndpoint
      queryEndpoint
    }
  }
`;

export const STOP_PROJECT = gql`
  mutation StopProject($id: String!) {
    stopProject(id: $id) {
      id
      status
      networkEndpoint
      nodeEndpoint
      queryEndpoint
    }
  }
`;

export const GET_CONTROLLERS = gql`
  query {
    controllers {
      id
      address
    }
  }
`;

export const ADD_CONTROLLER = gql`
  mutation AddController {
    addController
  }
`;

export const REMOVE_CONTROLLER = gql`
  mutation RemoveController($id: String!) {
    removeController(id: $id) {
      id
    }
  }
`;

export const WITHDRAW_CONTROLLER = gql`
  query WithdrawController($id: String!) {
    withrawController(id: $id)
  }
`;

export const REMOVE_ACCOUNTS = gql`
  mutation {
    removeAccounts
  }
`;

export const ADD_PROJECT = gql`
  mutation AddProject($id: String!) {
    addProject(id: $id) {
      id
      status
    }
  }
`;

export const REMOVE_PROJECT = gql`
  mutation RemoveProject($id: String!) {
    removeProject(id: $id) {
      status
    }
  }
`;

export const CHANNEL_CLOSE = gql`
  mutation ChannelClose($id: String!) {
    channelClose(id: $id) {
      id
      spent
      remote
      onchain
      lastFinal
    }
  }
`;

export const GET_PROJECT = gql`
  query Project($id: String!) {
    project(id: $id) {
      id
      status
      nodeEndpoint
      queryEndpoint
      networkEndpoint
      networkDictionary
      nodeVersion
      queryVersion
      forceEnabled
      paygPrice
      paygExpiration
      paygThreshold
      paygOverflow
    }
  }
`;

export const GET_PROJECTS = gql`
  query {
    getProjects {
      id
      status
      nodeEndpoint
      queryEndpoint
      networkEndpoint
      networkDictionary
      nodeVersion
      queryVersion
      paygPrice
      paygExpiration
      paygThreshold
      paygOverflow
    }
  }
`;

export const GET_LOG = gql`
  query GetLog($container: String!) {
    getLog(container: $container) {
      log
    }
  }
`;

export const GET_QUERY_METADATA = gql`
  query QueryMetadata($id: String!) {
    queryMetadata(id: $id) {
      lastProcessedHeight
      lastProcessedTimestamp
      targetHeight
      chain
      indexerHealthy
      indexerNodeVersion
      queryNodeVersion
      indexerStatus
      queryStatus
    }
  }
`;

// query project registry
export const GET_INDEXER_PROJECTS = gql`
  query GetIndexerProjects($indexer: String!) {
    deploymentIndexers(filter: { indexerId: { equalTo: $indexer } }) {
      nodes {
        indexerId
        deploymentId
        status
      }
    }
  }
`;

export const GET_PROJECT_DETAILS = gql`
  query GetProjectDetails($deploymentId: String!) {
    deployments(filter: { id: { equalTo: $deploymentId } }) {
      nodes {
        id
        projectId
        project {
          owner
          currentVersion
          currentDeployment
          createdTimestamp
          updatedTimestamp
          metadata
        }
      }
    }
  }
`;

// query docker image versions
export const GET_REGISTRY_VERSIONS = gql`
  query GetRegistryVersions($range: String!, $registry: String!) {
    getRegistryVersions(range: $range, registry: $registry)
  }
`;

// PAYG
export const PAYG_PRICE = gql`
  mutation PaygProject(
    $paygPrice: String!
    $paygExpiration: Float!
    $paygThreshold: Float!
    $paygOverflow: Float!
    $id: String!
  ) {
    paygProject(
      paygPrice: $paygPrice
      paygExpiration: $paygExpiration
      paygThreshold: $paygThreshold
      paygOverflow: $paygOverflow
      id: $id
    ) {
      id
      paygPrice
      paygExpiration
      paygThreshold
      paygOverflow
    }
  }
`;

// TODO: don't need this anymore
export const CHANNEL_CHECKPOINT = gql`
  mutation ChannelCheckpoint($id: String!) {
    channelCheckpoint(id: $id) {
      id
      spent
      remote
      onchain
    }
  }
`;
