// Copyright 2020-2022 SubQuery Pte Ltd authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useCallback, useEffect, useState } from 'react';
import { useLazyQuery } from '@apollo/client';
import { useAsyncMemo } from '@subql/react-hooks';
import yaml from 'js-yaml';
import { isEmpty } from 'lodash';

import { useContractSDK } from 'containers/contractSdk';
import { useNotification } from 'containers/notificationContext';
import { useWeb3 } from 'hooks/web3Hook';
import {
  AsyncMemoReturn,
  ChainType,
  DockerRegistry,
  IndexingStatus,
  PartialIpfsDeploymentManifest,
  ProjectServiceMetadata,
  TQueryMetadata,
} from 'pages/project-details/types';
import { coordinatorServiceUrl, createApolloClient } from 'utils/apolloClient';
import { cat, cidToBytes32, IPFS_PROJECT_CLIENT } from 'utils/ipfs';
import {
  GET_INDEXER_PROJECTS,
  GET_PROJECT,
  GET_PROJECT_DETAILS,
  GET_QUERY_METADATA,
  GET_REGISTRY_VERSIONS,
} from 'utils/queries';

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
  indexerStatus: 'TERMINATED',
  queryStatus: 'TERMINATED',
};

const defaultProjectValue: ProjectServiceMetadata = {
  id: '',
  baseConfig: {
    networkEndpoint: '',
    networkDictionary: '',
    nodeVersion: '',
    queryVersion: '',
  },
  advancedConfig: {
    purgeDB: false,
    poiEnabled: true,
    timeout: 1800,
    worker: 2,
    batchSize: 50,
    cache: 300,
    cpu: 2,
    memory: 2046,
  },
  status: 0,
  paygPrice: 0,
  paygExpiration: 3600 * 24,
  // paygThreshold: 1000,
  // paygOverflow: 5,
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
  ...defaultProjectValue,
};

export const getProjectService = async (deploymentId: string) => {
  const { data } = await coordinatorClient.query({
    query: GET_PROJECT,
    variables: { id: deploymentId },
  });

  if (!data) {
    return defaultProjectValue;
  }

  return data.project;
};

export const useProjectService = (deploymentId: string) => {
  const { notification } = useNotification();
  const [projectService, setService] = useState<ProjectServiceMetadata>(defaultProjectValue);
  const [getProject, { data }] = useLazyQuery(GET_PROJECT, { fetchPolicy: 'network-only' });

  const getProjectService = useCallback(() => {
    return getProject({ variables: { id: deploymentId } });
  }, [deploymentId, getProject]);

  useEffect(() => {
    data
      ? setService({
          ...data.project,
          ...data.project.baseConfig,
          ...data.project.advancedConfig,
        })
      : getProjectService();
  }, [deploymentId, data, notification?.type, getProjectService]);

  return { projectService, getProjectService };
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

type IndexerProject = {
  indexerId: string;
  deploymentId: string;
  status: string;
};

export const queryRegistryClient = createApolloClient(window.env.REGISTRY_PROJECT);
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

  const projectMetadata = await cat(projectInfo.metadata);
  const queryMetadata = await getQueryMetadata(deploymentId);
  const projectDetails = {
    ...projectInfo,
    ...projectMetadata,
    metadata: queryMetadata,
    id: deploymentId,
  };

  return projectDetails;
};

export const getIndexingProjects = async (indexer: string): Promise<ProjectServiceMetadata[]> => {
  const res = await queryRegistryClient.query<{ deploymentIndexers: { nodes: IndexerProject[] } }>({
    query: GET_INDEXER_PROJECTS,
    variables: { indexer },
  });

  const projects = res.data.deploymentIndexers.nodes;
  return projects
    .filter((p) => p.status !== 'TERMINATED')
    .map((p) => ({ ...defaultProjectValue, id: p.deploymentId }));
};

export const useProjectDetails = (
  deploymentId: string
): AsyncMemoReturn<ProjectDetails | undefined> => {
  const { notification } = useNotification();

  return useAsyncMemo(async () => {
    try {
      const projectDetails = await getProjectDetails(deploymentId);
      return projectDetails;
    } catch (error) {
      return undefined;
    }
  }, [deploymentId, notification?.type]);
};

export const useDeploymentStatus = (deploymentId: string) => {
  const [status, setStatus] = useState<IndexingStatus | undefined>();
  const { account } = useWeb3();
  const sdk = useContractSDK();

  const getDeploymentStatus = useCallback(async () => {
    if (!sdk || !account || !deploymentId) return;
    const { status } = await sdk.queryRegistry.deploymentStatusByIndexer(
      cidToBytes32(deploymentId),
      account
    );

    setStatus(status);
  }, [sdk, account, deploymentId]);

  useEffect(() => {
    getDeploymentStatus();
  }, [getDeploymentStatus]);

  return status;
};

export function combineProjects(
  localProjects: ProjectServiceMetadata[],
  indexingProjects: ProjectServiceMetadata[]
): ProjectServiceMetadata[] {
  if (isEmpty(localProjects)) return indexingProjects;
  const removedProjects = indexingProjects.filter(
    (p) => !localProjects.find((lp) => lp.id === p.id)
  );

  return [...localProjects, ...removedProjects];
}

export const getManifest = async (cid: string) => {
  const projectYaml = await cat(cid, IPFS_PROJECT_CLIENT);
  const resultManifest = yaml.load(projectYaml) as PartialIpfsDeploymentManifest;
  return resultManifest;
};

// TODO: migrate to docker registry module
function dockerRegistryFromChain(chainType: ChainType): DockerRegistry {
  switch (chainType) {
    case 'cosmos':
      return DockerRegistry.cosmos;
    case 'avalanche':
      return DockerRegistry.avalanche;
    default:
      return DockerRegistry.substrateNode;
  }
}

const defaultRange = {
  substrate: '>=1.1.1',
  cosmos: '>=0.1.0',
  avalanche: '>=0.1.1',
};

export const useNodeVersions = (cid: string): string[] => {
  const [getNodeVersions, { data }] = useLazyQuery(GET_REGISTRY_VERSIONS);

  const fetchNodeVersions = useCallback(async () => {
    const manifest = await getManifest(cid);
    const { dataSources, runner } = manifest;
    const runtime = dataSources[0].kind;
    const chainType = runtime.split('/')[0] as ChainType;

    const registry = dockerRegistryFromChain(chainType);
    const range = runner?.node?.version ?? defaultRange[chainType];
    getNodeVersions({ variables: { range, registry } });
  }, [cid, getNodeVersions]);

  useEffect(() => {
    fetchNodeVersions();
  }, [fetchNodeVersions]);

  const registryVersions = data?.getRegistryVersions;

  // FIXME: special filter for subql-node [v1.2.1]
  const versions = registryVersions?.filter((v: string) => v !== 'v1.2.1');
  return !isEmpty(versions) ? versions : [];
};

export const useQueryVersions = (cid: string): string[] => {
  const [getQueryVersions, { data }] = useLazyQuery(GET_REGISTRY_VERSIONS);

  const fetchQueryVersions = useCallback(async () => {
    const manifest = await getManifest(cid);
    const range = manifest.runner?.query?.version ?? '>=0.15.0';
    getQueryVersions({ variables: { range, registry: DockerRegistry.query } });
  }, [cid, getQueryVersions]);

  useEffect(() => {
    fetchQueryVersions();
  }, [fetchQueryVersions]);

  const versions = data?.getRegistryVersions;
  return !isEmpty(versions) ? versions : [];
};
