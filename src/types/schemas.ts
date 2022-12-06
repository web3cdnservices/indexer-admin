// Copyright 2020-2022 SubQuery Pte Ltd authors & contributors
// SPDX-License-Identifier: Apache-2.0

import * as yup from 'yup';

import { IndexerMetadata } from 'pages/account/types';
import { ProjectConfig } from 'pages/project-details/types';

// indexer register
export enum RegisterFormKey {
  name = 'name',
  proxyEndpoint = 'proxyEndpoint',
  amount = 'amount',
  rate = 'rate',
}

export const RegisterFormSchema = yup.object({
  [RegisterFormKey.name]: yup.string().defined(),
  [RegisterFormKey.proxyEndpoint]: yup.string().defined(),
  [RegisterFormKey.amount]: yup
    .number()
    .min(1000, 'Staking token should large than 1000 SQT')
    .defined(),
  [RegisterFormKey.rate]: yup
    .number()
    .min(0, 'Rate should be between 0 and 100')
    .max(100, 'Rate should be between 0 and 100')
    .defined(),
});

export const initialRegisterValues = {
  [RegisterFormKey.name]: '',
  [RegisterFormKey.proxyEndpoint]: '',
  [RegisterFormKey.amount]: 0,
  [RegisterFormKey.rate]: 0,
};

export type TRegisterValues = yup.Asserts<typeof RegisterFormSchema>;

// update metadata
export enum MetadataFormKey {
  name = 'name',
  proxyEndpoint = 'proxyEndpoint',
}

export const MetadataFormSchema = yup.object({
  [RegisterFormKey.name]: yup.string().defined(),
  [RegisterFormKey.proxyEndpoint]: yup.string().defined(),
});

export const initialMetadataValues = (metadata?: IndexerMetadata) => ({
  [RegisterFormKey.name]: metadata?.name,
  [RegisterFormKey.proxyEndpoint]: metadata?.url,
});

export type TMetadataValues = yup.Asserts<typeof MetadataFormSchema>;

// config controllerItem
export enum ControllerFormKey {
  privateKey = 'privateKey',
}

export const ControllerFormSchema = yup.object({
  [ControllerFormKey.privateKey]: yup.string().defined(),
});

export const initialControllerValues = {
  [ControllerFormKey.privateKey]: '',
};

// add project
export enum ProjectFormKey {
  deploymentId = 'deploymentId',
  networkEndpoint = 'networkEndpoint',
  networkDictionary = 'networkDictionary',
  nodeVersion = 'nodeVersion',
  queryVersion = 'queryVersion',
  forceEnabled = 'forceEnabled',
  // FIXME: remove
  paygPrice = 'paygPrice',
  paygExpiration = 'paygExpiration',
  paygThreshold = 'paygThreshold',
  paygOverflow = 'paygOverflow',
}

export const CIDv0 = new RegExp(/^Qm[1-9A-HJ-NP-Za-km-z]{44}/i);
export const ProjectFormSchema = yup.object({
  [ProjectFormKey.deploymentId]: yup
    .string()
    .matches(CIDv0, `Invalid deployment id format`)
    .defined(),
});

export const initialProjectValues = {
  [ProjectFormKey.deploymentId]: '',
};

// start indexing project
export const initialIndexingValues = (config: ProjectConfig) => ({
  [ProjectFormKey.networkEndpoint]: config.networkEndpoint,
  [ProjectFormKey.networkDictionary]: config.networkDictionary ?? '',
  [ProjectFormKey.nodeVersion]: config.nodeVersion,
  [ProjectFormKey.queryVersion]: config.queryVersion,
  [ProjectFormKey.forceEnabled]: config.forceEnabled,
});

export const StartIndexingSchema = yup.object({
  [ProjectFormKey.networkEndpoint]: yup.string().defined(),
  [ProjectFormKey.networkDictionary]: yup.string().optional(),
  [ProjectFormKey.nodeVersion]: yup.string().defined(),
  [ProjectFormKey.queryVersion]: yup.string().defined(),
  [ProjectFormKey.forceEnabled]: yup.boolean().required(),
});

export type IndexingEndpoint = yup.Asserts<typeof StartIndexingSchema>;

// PAYG
export enum OpenPAYGFormKey {
  paygPrice = 'paygPrice',
  paygPeriod = 'paygPeriod',
}

export const initalPAYGValues = (config: ProjectConfig) => ({
  [OpenPAYGFormKey.paygPrice]: config.paygPrice,
  [OpenPAYGFormKey.paygPeriod]: config.paygExpiration,
});

export const ProjectPaygSchema = yup.object({
  [OpenPAYGFormKey.paygPrice]: yup.string().defined(),
  [OpenPAYGFormKey.paygPeriod]: yup.number().defined(),
});
