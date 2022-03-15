// Copyright 2020-2022 SubQuery Pte Ltd authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { gql } from '@apollo/client';

export type QueryResult = {
  loading?: boolean;
  data?: any;
  error?: Error;
};

export const GET_COORDINATOR_INDEXER = gql`
  query {
    accountMetadata {
      indexer
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

export const START_PROJECT = gql`
  mutation StartProject($networkEndpoint: String!, $id: String!) {
    startProject(networkEndpoint: $networkEndpoint, id: $id) {
      id
      status
      networkEndpoint
      nodeEndpoint
      queryEndpoint
    }
  }
`;

export const STOP_PROJECT = gql`
  mutation RestartProject($id: String!) {
    stopProject(id: $id) {
      id
      status
      networkEndpoint
      nodeEndpoint
      queryEndpoint
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

export const CONFIG_SERVICES = gql`
  mutation UpdateServices($queryEndpoint: String!, $nodeEndpoint: String!, $id: String!) {
    updateProjectServices(queryEndpoint: $queryEndpoint, nodeEndpoint: $nodeEndpoint, id: $id) {
      status
      nodeEndpoint
      queryEndpoint
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
