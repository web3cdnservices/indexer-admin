// Copyright 2020-2022 SubQuery Pte Ltd authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useCallback, useEffect, useState } from 'react';
import { useLazyQuery } from '@apollo/client';
import { isEmpty, isUndefined } from 'lodash';

import { useContractSDK } from 'containers/contractSdk';
import { useLoading } from 'containers/loadingContext';
import { useNotification } from 'containers/notificationContext';
import { useWeb3 } from 'hooks/web3Hook';
import { ProjectServiceMetadata, TQueryMetadata } from 'pages/project-details/types';
import { IndexingStatus } from 'pages/projects/constant';
import { coordinatorServiceUrl, createApolloClient } from 'utils/apolloClient';
import { cidToBytes32, getMetadata } from 'utils/ipfs';
import { GET_PROJECT, GET_PROJECT_DETAILS, GET_QUERY_METADATA } from 'utils/queries';

// TODO: review whether need default value or other ways to provide default value
// TODO: refactor get project details
const metadataInitValue = {
  lastProcessedHeight: 0,
  lastProcessedTimestamp: 0,
  targetHeight: 0,
  chain: '',
  specName: '',
  genesisHash: '',
  indexerHealthy: undefined,
  indexerNodeVersion: '',
  queryNodeVersion: '',
  indexerStatus: '',
  queryStatus: '',
};

const projectInitValue = {
  name: '',
  owner: '',
  image: '',
  description: '',
  websiteUrl: '',
  codeUrl: '',
  version: '',
  currentDeployment: '',
  currentVersion: '',
  versionDescription: '',
  createdTimestamp: '',
  updatedTimestamp: '',
  metadata: undefined,
  id: '',
  networkEndpoint: '',
  networkDictionary: '',
  queryEndpoint: '',
  nodeEndpoint: '',
  status: 0,
};

export const useProjectService = (deploymentId: string) => {
  const { notification } = useNotification();
  const [projectService, setService] = useState<ProjectServiceMetadata>();
  const [getProjectService, { data }] = useLazyQuery(GET_PROJECT, {
    fetchPolicy: 'network-only',
  });

  useEffect(() => {
    data ? setService(data.project) : getProjectService({ variables: { id: deploymentId } });
  }, [deploymentId, data, notification?.type]);

  return projectService;
};

export const useIndexingStatus = (deploymentId: string): IndexingStatus | undefined => {
  const [status, setStatus] = useState<IndexingStatus>();
  const { account } = useWeb3();
  const notificationContext = useNotification();
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
  }, [sdk, account, deploymentId, notificationContext.notification?.type]);

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
  metadata: TQueryMetadata | undefined;
} & ProjectServiceMetadata;

type Result = {
  id: string;
  projectId: string;
  project: {
    currentDeployment: string;
    currentVersion: string;
    versionDescription: string;
    createdTimestamp: string;
    updatedTimestamp: string;
    metadata: string;
  };
};

const queryRegistryClient = createApolloClient(window.env.REGISTRY_PROJECT);
const coordinatorClient = createApolloClient(coordinatorServiceUrl);

export const getQueryMetadata = async (id: string): Promise<TQueryMetadata> => {
  try {
    const result = await coordinatorClient.query<{ queryMetadata: TQueryMetadata }>({
      query: GET_QUERY_METADATA,
      variables: { id },
      fetchPolicy: 'network-only',
    });
    return result.data.queryMetadata;
  } catch {
    return metadataInitValue;
  }
};

export const getProjectDetails = async (deploymentId: string): Promise<ProjectDetails> => {
  const res = await queryRegistryClient.query<{ deployments: { nodes: Result[] } }>({
    query: GET_PROJECT_DETAILS,
    variables: { deploymentId },
  });

  const projectInfo = res.data.deployments.nodes[0]?.project;
  if (!projectInfo) {
    console.error('Unable to get metadata for project');
    return projectInitValue;
  }

  const projectMetadata = await getMetadata(projectInfo.metadata);
  const queryMetadata = await getQueryMetadata(deploymentId);
  const projectDetails = {
    ...projectInfo,
    ...projectMetadata,
    metadata: queryMetadata,
    id: deploymentId,
  };

  return projectDetails;
};

export const useProjectDetails = (deploymentId: string): ProjectDetails | undefined => {
  const [project, setProject] = useState<ProjectDetails | undefined>();
  const { notification } = useNotification();

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
  }, [fetchMeta, notification?.type]);

  return project;
};

// TODO: need to refactor
export function useProjectDetailList(data: any) {
  const projects = data?.getProjects as ProjectServiceMetadata[];
  const [projectDetailList, setProjecList] = useState<ProjectDetails[]>();

  const { setPageLoading } = useLoading();
  const { account } = useWeb3();
  const sdk = useContractSDK();

  const getProjectStatus = useCallback(
    async (deploymentId: string) => {
      if (!sdk || !account || !deploymentId) return IndexingStatus.NOTINDEXING;
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
        projects.map(({ id }) =>
          Promise.all([getProjectDetails(id), getQueryMetadata(id), getProjectStatus(id)])
        )
      );
      setProjecList(
        result
          .map(([detail, metadata, status]) => ({ ...detail, status, metadata }))
          .filter(({ id }) => !!id)
      );
    } catch (e) {
      console.error('Get project details failed:', e);
      setPageLoading(false);
    }
  }, [projects]);

  useEffect(() => {
    getProjectDetailList();
  }, [getProjectDetailList, data]);

  return { projectDetailList, getProjectDetailList };
}
