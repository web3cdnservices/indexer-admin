// Copyright 2020-2021 OnFinality Limited authors & contributors
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
}

export const RegisterFormSchema = yup.object({
  [RegisterFormKey.name]: yup.string().defined(),
  [RegisterFormKey.proxyEndpoint]: yup.string().defined(),
  [RegisterFormKey.amount]: yup
    .number()
    .min(1000, 'Staking token should large than 1000 SQT')
    .defined(),
});

export const initialRegisterValues = {
  [RegisterFormKey.name]: '',
  [RegisterFormKey.proxyEndpoint]: '',
  [RegisterFormKey.amount]: 0,
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
  indexerEndpoint = 'indexerEndpoint',
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

// start project
export const StartProjectSchema = yup.object({
  [ProjectFormKey.indexerEndpoint]: yup.string().defined(),
});

export const initialStartProjectValues = {
  [ProjectFormKey.indexerEndpoint]: '',
};

// pub project to ready
export const publishProjectSchema = yup.object({
  [ProjectFormKey.queryEndpoint]: yup.string().defined(),
});

export const initialPublishProjectValues = {
  [ProjectFormKey.queryEndpoint]: '',
};

// stop project
