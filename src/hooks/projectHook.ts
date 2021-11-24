// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useEffect, useState } from 'react';
import { ApolloError, useQuery } from '@apollo/client';
import { GET_PROJECT } from '../utils/queries';

// TODO: move to `type` file
type TProject = {
  id: string;
  status: string;
  nodeEndpoint: string;
  queryEndpoint: string;
};

type ProjectResponse = {
  data: TProject | undefined;
  error: ApolloError | undefined;
  loading: boolean;
};

const INITIALISED_PROJECT = {
  data: undefined,
  error: undefined,
  loading: false,
};

export const useProject = (deploymentId: string) => {
  // TODO: validate `deploymentID`

  const [project, setProject] = useState<ProjectResponse>(INITIALISED_PROJECT);
  const { data, error, loading } = useQuery(GET_PROJECT, { variables: { id: deploymentId } });

  useEffect(() => {
    setProject({ data, error, loading });
  }, [deploymentId, data, error, loading]);

  return project;
};
