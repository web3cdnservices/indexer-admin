// Copyright 2020-2022 SubQuery Pte Ltd authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { FormikHelpers, FormikValues } from 'formik';

export enum DockerRegistry {
  query = 'onfinality/subql-query',
  node = 'onfinality/subql-node',
}

export enum IndexingStatus {
  NOTINDEXING,
  INDEXING,
  READY,
}

export enum ProjectStatus {
  NotIndexing = 'NOT INDEXING',
  Started = 'STARTED',
  Indexing = 'INDEXING',
  Ready = 'READY',
  Terminated = 'TERMINATED',
}

export type TransactionType =
  | ProjectAction.AnnounceIndexing
  | ProjectAction.AnnounceReady
  | ProjectAction.AnnounceNotIndexing;

export enum AccountAction {
  unregister = 'unregister',
  updateMetaData = 'updateMetadata',
  configCntroller = 'configCntroller',
}

export enum ProjectsAction {
  addProject = 'addProject',
}

export enum ProjectAction {
  StartIndexing = 'StartIndexing',
  AnnounceIndexing = 'AnnounceIndexing',
  RestartProject = 'RestartProject',
  AnnounceReady = 'AnnounceReady',
  StopProject = 'StopProject',
  AnnounceNotIndexing = 'AnnounceNotIndexing',
  StopIndexing = 'StopIndexing',
  RemoveProject = 'Remove Project',
}

export type ModalAction = AccountAction | ProjectsAction | ProjectAction;

export type ClickAction = (type?: ModalAction) => void;
export type FormSubmit = (values: FormikValues, helper: FormikHelpers<FormikValues>) => void;

export type ProjectConfig = {
  networkEndpoint: string;
  networkDictionary: string;
  nodeVersion: string;
  queryVersion: string;
  poiEnabled: boolean;
};

export type ProjectServiceMetadata = {
  id: string;
  status: IndexingStatus;
} & ProjectConfig;

export type TQueryMetadata = {
  lastProcessedHeight: number;
  lastProcessedTimestamp: number;
  targetHeight: number;
  chain: string;
  specName: string;
  genesisHash: string;
  indexerHealthy?: boolean;
  indexerNodeVersion: string;
  queryNodeVersion: string;
  indexerStatus: string;
  queryStatus: string;
};

// manifest types
export type Runner = {
  node?: {
    name: string;
    version: string;
  };
  query?: {
    name: string;
    version: string;
  };
};

export type partialIpfsDeploymentManifest = {
  dataSources: any[];
  schema: {
    file: string;
  };
  network: {
    chainId?: string;
  };
  specVersion: string;
  runner?: Runner;
};
