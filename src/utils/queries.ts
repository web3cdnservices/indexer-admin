// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { gql } from '@apollo/client';

export const GET_ACCOUNT_METADATA = gql`
  query {
    accountMetadata {
      indexer
      network
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

export const ADD_PROJECT = gql`
  mutation AddProject($id: String!) {
    addProject(id: $id) {
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
