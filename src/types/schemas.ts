// Copyright 2020-2022 SubQuery Pte Ltd authors & contributors
// SPDX-License-Identifier: Apache-2.0

import * as yup from 'yup';

// login config
export enum LoginFormKey {
  endpoint = 'endpoint',
  networkType = 'networkType',
}

export const networkOptions = ['mainnet', 'testnet', 'local'];

export const loginFormSchema = yup.object({
  [LoginFormKey.endpoint]: yup.string().defined(),
  [LoginFormKey.networkType]: yup
    .string()
    .test(
      'Select a network',
      'Must select a network',
      (network) => !!(network && networkOptions.includes(network))
    )
    .defined(),
});

export const initialLoginValues = {
  [LoginFormKey.endpoint]: '',
  [LoginFormKey.networkType]: 'Mainnet',
};

export type TLoginValues = yup.Asserts<typeof loginFormSchema>;

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
    .min(0, `Rate should be between 0 and 100`)
    .max(100, `Rate should be between 0 and 100`)
    .defined(),
});

export const initialRegisterValues = {
  [RegisterFormKey.name]: '',
  [RegisterFormKey.proxyEndpoint]: '',
  [RegisterFormKey.amount]: 0,
  [RegisterFormKey.rate]: 0,
};

export type TRegisterValues = yup.Asserts<typeof RegisterFormSchema>;

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
  nodeEndpoint = 'nodeEndpoint',
  queryEndpoint = 'queryEndpoint',
}

export const CIDv0 = new RegExp(/Qm[1-9A-HJ-NP-Za-km-z]{44}/i);
export const ProjectFormSchema = yup.object({
  [ProjectFormKey.deploymentId]: yup
    .string()
    .matches(CIDv0, `Doesn't match deployment id format`)
    .defined(),
});

export const initialProjectValues = {
  [ProjectFormKey.deploymentId]: '',
};

// start indexing project
// TODO: valid the url format
export const StartIndexingSchema = yup.object({
  [ProjectFormKey.networkEndpoint]: yup.string().defined(),
});

export const initialIndexingValues = {
  [ProjectFormKey.networkEndpoint]: '',
};

// config services
export const ConfigServicesSchema = yup.object({
  [ProjectFormKey.nodeEndpoint]: yup.string().defined(),
  [ProjectFormKey.queryEndpoint]: yup.string().defined(),
});

export const initialServiceValues = {
  [ProjectFormKey.nodeEndpoint]: '',
  [ProjectFormKey.queryEndpoint]: '',
};
