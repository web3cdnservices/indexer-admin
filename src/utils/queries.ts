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
  mutation StartProject($id: String!) {
    createAndStartProject(id: $id) {
      id
      status
      indexerEndpoint
      queryEndpoint
    }
  }
`;

export const RESTART_PROJECT = gql`
  mutation RestartProject($id: String!) {
    restartProject(id: $id) {
      id
      status
      indexerEndpoint
      queryEndpoint
    }
  }
`;

export const STOP_PROJECT = gql`
  mutation RestartProject($id: String!) {
    stopProject(id: $id) {
      id
      status
      indexerEndpoint
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
  mutation UpdateServices($queryEndpoint: String!, $indexerEndpoint: String!, $id: String!) {
    updateProjectServices(
      queryEndpoint: $queryEndpoint
      indexerEndpoint: $indexerEndpoint
      id: $id
    ) {
      status
      indexerEndpoint
      queryEndpoint
    }
  }
`;

export const UPDATE_PROJECT_STATUS = gql`
  mutation UpdateProjectStatus($status: float!, $id: String!) {
    updateProjectStatus(status: $status, id: $id) {
      id
      status
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
