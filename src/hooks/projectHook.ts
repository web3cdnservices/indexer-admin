// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useEffect, useState } from 'react';
import { ApolloError, useQuery } from '@apollo/client';
import { GET_PROJECT } from '../utils/queries';
import { useWeb3 } from './web3Hook';
import { useContractSDK } from '../containers/contractSdk';
import { IndexingStatus } from '../pages/projects/constant';
import { TProjectMetadata } from '../pages/project-details/types';

// TODO: move to `type` file
type TDeps = boolean | number | string;

type ProjectResponse = {
  data: TProjectMetadata | undefined;
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

export const useIndexingStatus = (deploymentId: string, deps?: TDeps) => {
  const [status, setStatus] = useState(IndexingStatus.NOTSTART);
  const { account } = useWeb3();
  const sdk = useContractSDK();

  useEffect(() => {
    if (sdk && account && deploymentId) {
      sdk.queryRegistry
        .deploymentStatusByIndexer(deploymentId, account)
        .then(({ status }) => {
          setStatus(status);
        })
        .catch((error) => console.error(error));
    }
  }, [sdk, account, deploymentId, deps]);

  return status;
};

export const useDefaultLoading = () => {
  const [loading, setLoaing] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoaing(false), 1500);
  }, []);

  return loading;
};
