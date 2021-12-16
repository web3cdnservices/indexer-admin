// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useCallback, useEffect, useState } from 'react';
import { ApolloClient, InMemoryCache, useLazyQuery } from '@apollo/client';
import { get, isEmpty, isUndefined } from 'lodash';

import { useContractSDK } from 'containers/contractSdk';
import { useLoading } from 'containers/loadingContext';
import { useWeb3 } from 'hooks/web3Hook';
import { TQueryMetadata, TServiceMetadata } from 'pages/project-details/types';
import { IndexingStatus } from 'pages/projects/constant';
import { HookDependency } from 'types/types';
import { createApolloClient } from 'utils/apolloClient';
import { cidToBytes32, concatU8A, IPFS } from 'utils/ipfs';
import {
  GET_PROJECT,
  GET_QUERY_METADATA,
  QUERY_REGISTRY_GET_DEPLOYMENT_PROJECTS,
} from 'utils/queries';

export const useProjectService = (deploymentId: string) => {
  const [projectService, setService] = useState<TServiceMetadata>();
  const [getProjectService, { data }] = useLazyQuery(GET_PROJECT, {
    fetchPolicy: 'network-only',
  });

  useEffect(() => {
    data ? setService(data.project) : getProjectService({ variables: { id: deploymentId } });
  }, [deploymentId, data]);

  return projectService;
};

export const useIndexingStatus = (deploymentId: string, deps?: HookDependency) => {
  const [status, setStatus] = useState(IndexingStatus.NOTSTART);
  const { account } = useWeb3();
  const sdk = useContractSDK();

  useEffect(() => {
    if (sdk && account && deploymentId) {
      sdk.queryRegistry
        .deploymentStatusByIndexer(cidToBytes32(deploymentId), account)
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
  owner: string;
  image: string;
  description: string;
  websiteUrl: string;
  codeUrl: string;
  version: string;
  currentDeployment: string;
  currentVersion: string;
  versionDescription: string;
  createdTimestamp: string;
  updatedTimestamp: string;
  queryMetadata: TQueryMetadata | undefined;
} & TServiceMetadata;

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

export const getProjectInfo = async (deploymentId: string) => {
  const result = await queryRegistryClient.query<{ projectDeployments: { nodes: Result[] } }>({
    query: QUERY_REGISTRY_GET_DEPLOYMENT_PROJECTS,
    variables: { deploymentId },
  });
  return result;
};

export const getProjectDetails = async (deploymentId: string): Promise<ProjectDetails> => {
  const res = await getProjectInfo(deploymentId);
  const projectInfo = res.data.projectDeployments.nodes[0]?.project;
  if (!projectInfo) {
    throw new Error('Unable to get metadata for project');
  }

  const metadataCid = projectInfo.metadata;
  const results = IPFS.cat(metadataCid);
  let raw: Uint8Array | undefined;
  // eslint-disable-next-line no-restricted-syntax
  for await (const result of results) {
    raw = raw ? concatU8A(raw, result) : result;
  }
  if (!raw) {
    throw new Error('Unable to fetch metadata from ipfs');
  }

  const metadata = JSON.parse(Buffer.from(raw).toString('utf8'));
  const projectDetails: ProjectDetails = { ...projectInfo, ...metadata, id: deploymentId };
  return projectDetails;
};

export const useProjectDetails = (data: ProjectDetails): ProjectDetails | undefined => {
  const [project, setProject] = useState<ProjectDetails | undefined>(data);
  const deploymentId = data.id;
  // TODO: add query metadata and status in the request

  const fetchMeta = useCallback(async () => {
    try {
      const projectDetails = await getProjectDetails(deploymentId);
      setProject(projectDetails);
    } catch (error) {
      setProject(undefined);
      console.error('Unable to get project details', error);
    }
  }, [deploymentId]);

  useEffect(() => {
    fetchMeta();
  }, [fetchMeta]);

  return project;
};

export function useProjectDetailList(data: any) {
  const projects = data?.getProjects as TServiceMetadata[];
  const [projectDetailList, setProjecList] = useState<ProjectDetails[]>();

  const { setPageLoading } = useLoading();
  const { account } = useWeb3();
  const sdk = useContractSDK();

  const getQueryServiceData = useCallback(async (url) => {
    if (!url) return undefined;

    const data = await createApolloClient(`${url}/graphql`).query({ query: GET_QUERY_METADATA });
    const metadata = get(data, 'data._metadata', null) as TQueryMetadata;
    return metadata;
  }, []);

  const getProjectStatus = useCallback(
    async (deploymentId: string) => {
      if (!sdk || !account || !deploymentId) return IndexingStatus.NOTSTART;
      const { status } = await sdk.queryRegistry.deploymentStatusByIndexer(
        cidToBytes32(deploymentId),
        account
      );
      return status;
    },
    [sdk, account]
  );

  const getProjectDetailList = useCallback(async () => {
    if (isUndefined(projects)) return;
    if (isEmpty(projects)) {
      setPageLoading(false);
      setProjecList([]);
      return;
    }

    try {
      const result = await Promise.all(
        projects.map(({ id, queryEndpoint }) =>
          Promise.all([
            getProjectDetails(id),
            getQueryServiceData(queryEndpoint),
            getProjectStatus(id),
          ])
        )
      );
      setProjecList(
        result.map(([detail, queryMetadata, status]) => ({ ...detail, status, queryMetadata }))
      );
      setPageLoading(false);
    } catch (e) {
      console.error('Get project details failed:', e);
      setPageLoading(false);
    }
  }, [projects]);

  useEffect(() => {
    getProjectDetailList();
  }, [getProjectDetailList]);

  return projectDetailList;
}
