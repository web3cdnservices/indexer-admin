// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useCallback, useEffect, useState } from 'react';
import { ApolloClient, ApolloError, gql, InMemoryCache, useQuery } from '@apollo/client';
import { useContractSDK } from 'containers/contractSdk';

import { concatU8A, IPFS } from 'utils/ipfs';
import { GET_PROJECT } from 'utils/queries';

import { TProjectMetadata } from '../pages/project-details/types';
import { IndexingStatus } from '../pages/projects/constant';
import { useWeb3 } from './web3Hook';

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

export type ProjectDetails = {
  name: string;
  image: string;
  description: string;
  websiteUrl: string;
  codeUrl: string;
  version: string;
  versionDescription: string;
};

type Result = {
  id: string;
  projectId: string;
  deploymentId: string;
  project: {
    metadata: string;
  };
};

const queryRegistryClient = new ApolloClient({
  uri: process.env.REACT_APP_QUERY_REGISTRY_PROJECT,
  cache: new InMemoryCache(),
});

export const QUERY_REGISTRY_GET_DEPLOYMENT_PROJECTS = gql`
  query GetDeploymentProjects($deploymentId: String!) {
    projectDeployments(filter: { deploymentId: { equalTo: $deploymentId } }) {
      nodes {
        id
        projectId
        deploymentId
        project {
          metadata
        }
      }
    }
  }
`;

export const useProjectMetadata = (deploymentId: string): ProjectDetails | undefined => {
  const [metadata, setMetadata] = useState<ProjectDetails>();

  const fetchMeta = useCallback(async () => {
    try {
      if (!deploymentId) {
        setMetadata(undefined);
        return;
      }

      const res = await queryRegistryClient.query<{ projectDeployments: { nodes: Result[] } }>({
        query: QUERY_REGISTRY_GET_DEPLOYMENT_PROJECTS,
        variables: { deploymentId },
      });

      const metadataCid = res.data.projectDeployments.nodes[0]?.project?.metadata;

      if (!metadataCid) {
        throw new Error('Unable to get metadata for project');
      }

      const results = IPFS.cat(metadataCid);

      let raw: Uint8Array | undefined;

      // eslint-disable-next-line no-restricted-syntax
      for await (const result of results) {
        if (!raw) {
          raw = result;
        } else {
          raw = concatU8A(raw, result);
        }
      }

      if (!raw) {
        throw new Error('Unable to fetch metadata from ipfs');
      }

      setMetadata(JSON.parse(Buffer.from(raw).toString('utf8')));
    } catch (error) {
      setMetadata(undefined);
      console.error('Unable to get metadata', error);
    }
  }, [deploymentId]);

  useEffect(() => {
    fetchMeta();
  }, [fetchMeta]);

  return metadata;
};
