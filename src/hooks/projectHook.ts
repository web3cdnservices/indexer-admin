// Copyright 2020-2022 SubQuery Pte Ltd authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useCallback, useEffect, useState } from 'react';
import { useLazyQuery } from '@apollo/client';
import yaml from 'js-yaml';
import { isEmpty, isUndefined } from 'lodash';

import { useContractSDK } from 'containers/contractSdk';
import { useLoading } from 'containers/loadingContext';
import { useNotification } from 'containers/notificationContext';
import { useWeb3 } from 'hooks/web3Hook';
import {
  DockerRegistry,
  IndexingStatus,
  partialIpfsDeploymentManifest,
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

const projectServiceMetadtaValue: ProjectServiceMetadata = {
  id: '',
  networkEndpoint: '',
  networkDictionary: '',
  nodeVersion: '',
  queryVersion: '',
  poiEnabled: false,
  forceEnabled: false,
  status: 0,
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
  ...projectServiceMetadtaValue,
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

type IndexerProject = {
  indexerId: string;
  deploymentId: string;
  status: string;
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
    .map((p) => ({ ...projectServiceMetadtaValue, id: p.deploymentId }));
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

function combineProjects(
  localProjects: ProjectServiceMetadata[],
  indexingProjects: ProjectServiceMetadata[]
): ProjectServiceMetadata[] {
  if (isEmpty(localProjects)) return indexingProjects;
  const removedProjects = indexingProjects.filter(
    (p) => !localProjects.find((lp) => lp.id === p.id)
  );

  return [...localProjects, ...removedProjects];
}

// TODO: need to refactor
export function useProjectDetailList(data: any) {
  const [projectDetailList, setProjecList] = useState<ProjectDetails[]>();
  const localProjects = data?.getProjects as ProjectServiceMetadata[];

  const { setPageLoading } = useLoading();
  const { account } = useWeb3();

  const getProjectDetailList = useCallback(async () => {
    if (!account) return;

    const indexingProjects = await getIndexingProjects(account);
    const projects = combineProjects(localProjects, indexingProjects);

    if (isUndefined(projects)) return;
    if (isEmpty(projects)) {
      setPageLoading(false);
      setProjecList([]);
      return;
    }

    try {
      const result = await Promise.all(
        projects.map(({ id }) => Promise.all([getProjectDetails(id), getQueryMetadata(id)]))
      );
      setProjecList(
        result.map(([detail, metadata]) => ({ ...detail, metadata })).filter(({ id }) => !!id)
      );
    } catch (e) {
      console.error('Get project details failed:', e);
      setPageLoading(false);
    }
  }, [localProjects, account]);

  useEffect(() => {
    getProjectDetailList();
  }, [getProjectDetailList, data]);

  return { projectDetailList, getProjectDetailList };
}

export const getManifest = async (cid: string) => {
  const projectYaml = await cat(cid, IPFS_PROJECT_CLIENT);
  const resultManifest = yaml.load(projectYaml) as partialIpfsDeploymentManifest;
  return resultManifest;
};

// get image versions
const defaultNodeVersions = ['v1.0.0', 'v0.35.2', 'v0.35.1', 'v0.34.0'];
const defaultQueryVersions = ['v1.0.0', 'v0.16.0', 'v0.15.0'];

export const useNodeVersions = (cid: string) => {
  const [getNodeVersions, { data }] = useLazyQuery(GET_REGISTRY_VERSIONS);

  const fetchNodeVersions = useCallback(async () => {
    const manifest = await getManifest(cid);
    const range = manifest.runner?.node?.version ?? '>=0.34.0';
    getNodeVersions({ variables: { range, registry: DockerRegistry.node } });
  }, [cid]);

  useEffect(() => {
    fetchNodeVersions();
  }, [fetchNodeVersions]);

  const versions = data?.getRegistryVersions;
  return !isEmpty(versions) ? versions : defaultNodeVersions;
};

export const useQueryVersions = (cid: string) => {
  const [getQueryVersions, { data }] = useLazyQuery(GET_REGISTRY_VERSIONS);

  const fetchQueryVersions = useCallback(async () => {
    const manifest = await getManifest(cid);
    const range = manifest.runner?.query?.version ?? '>=0.15.0';
    getQueryVersions({ variables: { range, registry: DockerRegistry.query } });
  }, [cid]);

  useEffect(() => {
    fetchQueryVersions();
  }, [fetchQueryVersions]);

  const versions = data?.getRegistryVersions;
  return !isEmpty(versions) ? versions : defaultQueryVersions;
};
