// Copyright 2020-2022 SubQuery Pte Ltd authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useCallback, useEffect, useState } from 'react';
import { ApolloClient, InMemoryCache, useLazyQuery } from '@apollo/client';
import axios from 'axios';
import { get, isEmpty, isUndefined } from 'lodash';

import { useContractSDK } from 'containers/contractSdk';
import { useLoading } from 'containers/loadingContext';
import { useToast } from 'containers/toastContext';
import { useWeb3 } from 'hooks/web3Hook';
import { ProjectServiceMetadata, TQueryMetadata } from 'pages/project-details/types';
import { IndexingStatus } from 'pages/projects/constant';
import { cidToBytes32, getMetadata } from 'utils/ipfs';
import { getProxyServiceUrl } from 'utils/project';
import { GET_PROJECT, GET_PROJECT_DETAILS } from 'utils/queries';

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
  queryEndpoint: '',
  nodeEndpoint: '',
  status: 0,
};

export const useProjectService = (deploymentId: string) => {
  const { toast } = useToast();
  const [projectService, setService] = useState<ProjectServiceMetadata>();
  const [getProjectService, { data }] = useLazyQuery(GET_PROJECT, {
    fetchPolicy: 'network-only',
  });

  useEffect(() => {
    data ? setService(data.project) : getProjectService({ variables: { id: deploymentId } });
  }, [deploymentId, data, toast?.type]);

  return projectService;
};

export const useIndexingStatus = (deploymentId: string) => {
  const [status, setStatus] = useState(IndexingStatus.NOTINDEXING);
  const { account } = useWeb3();
  const toastContext = useToast();
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
  }, [sdk, account, deploymentId, toastContext.toast?.type]);

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

const queryRegistryClient = new ApolloClient({
  uri: window.env.REGISTRY_PROJECT,
  cache: new InMemoryCache(),
});

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
  const { toast } = useToast();

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
  }, [fetchMeta, toast?.type]);

  return project;
};

export async function getQueryMetadata(deploymentID: string): Promise<TQueryMetadata> {
  const body = {
    query: {
      query: `query { _metadata { ${[
        'lastProcessedHeight',
        'lastProcessedTimestamp',
        'targetHeight',
        'chain',
        'specName',
        'genesisHash',
        'indexerHealthy',
        'indexerNodeVersion',
        'queryNodeVersion',
      ].join(' ')} } }`,
    },
  };

  try {
    const result = await axios.post(getProxyServiceUrl(deploymentID), body);
    const metadata = get(result, 'data.data._metadata', null) as TQueryMetadata;
    return metadata;
  } catch {
    return metadataInitValue;
  }
}

export function useProjectDetailList(data: any) {
  const projects = data?.getProjects as ProjectServiceMetadata[];
  const [projectDetailList, setProjecList] = useState<ProjectDetails[]>();

  const { setPageLoading } = useLoading();
  const { account } = useWeb3();
  const sdk = useContractSDK();

  const getQueryServiceData = useCallback(async (id: string) => {
    if (!id) return undefined;
    const metadata = await getQueryMetadata(id);
    return metadata;
  }, []);

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
          Promise.all([getProjectDetails(id), getQueryServiceData(id), getProjectStatus(id)])
        )
      );
      setProjecList(
        result
          .map(([detail, metadata, status]) => ({ ...detail, status, metadata }))
          .filter(({ id }) => !!id)
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
