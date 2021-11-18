// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { gql } from '@apollo/client';

export const ADD_PROJECT = gql`
  mutation AddProject($id: ID!, $endpoint: String!) {
    addProject(id: $id, endpoint: $endpoint) {
      id
      endpoint
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
      nodeEndpoint
    }
  }
`;
