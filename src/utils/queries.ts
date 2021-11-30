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

export const START_PROJECT = gql`
  mutation StartProject($id: String!, $indexerEndpoint: String!) {
    startProject(id: $id, indexerEndpoint: $indexerEndpoint) {
      id
      status
    }
  }
`;

export const READY_PROJECT = gql`
  mutation ReadyProject($id: String!, $queryEndpoint: String!) {
    updateProjectToReady(id: $id, queryEndpoint: $queryEndpoint) {
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
