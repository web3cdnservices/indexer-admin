// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { gql } from '@apollo/client';

export type QueryResult = {
  loading?: boolean;
  data?: any;
  error?: Error;
};

export const GET_ACCOUNT_METADATA = gql`
  query {
    accountMetadata {
      indexer
      network
      wsEndpoint
    }
  }
`;

export const ADD_INDEXER = gql`
  mutation AddIndexer($indexer: String!) {
    addIndexer(indexer: $indexer) {
      indexer
    }
  }
`;

export const UPDAET_CONTROLLER = gql`
  mutation UpdateController($controller: String!) {
    updateController(controller: $controller) {
      indexer
      controller
    }
  }
`;

export const REMOVE_ACCOUNTS = gql`
  mutation {
    removeAccounts {
      id
    }
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

export const START_PROJECT = gql`
  mutation StartProject($indexerEndpoint: String!, $id: String!) {
    startProject(indexerEndpoint: $indexerEndpoint, id: $id) {
      id
      status
      indexerEndpoint
      queryEndpoint
    }
  }
`;

export const READY_PROJECT = gql`
  mutation ReadyProject($queryEndpoint: String!, $id: String!) {
    updateProjectToReady(queryEndpoint: $queryEndpoint, id: $id) {
      id
      status
      indexerEndpoint
      queryEndpoint
    }
  }
`;

export const GET_PROJECT = gql`
  query Project($id: String!) {
    project(id: $id) {
      id
      status
      indexerEndpoint
      queryEndpoint
    }
  }
`;

export const GET_PROJECTS = gql`
  query {
    getProjects {
      id
      status
      indexerEndpoint
      queryEndpoint
    }
  }
`;

export const GET_QUERY_METADATA = gql`
  query {
    _metadata {
      lastProcessedHeight
      lastProcessedTimestamp
      targetHeight
      chain
      specName
      genesisHash
      indexerHealthy
      indexerNodeVersion
      queryNodeVersion
    }
  }
`;

// query project registry
export const QUERY_REGISTRY_GET_DEPLOYMENT_PROJECTS = gql`
  query GetDeploymentProjects($deploymentId: String!) {
    projectDeployments(filter: { deploymentId: { equalTo: $deploymentId } }) {
      nodes {
        id
        projectId
        deploymentId
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
