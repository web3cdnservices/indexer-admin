// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import * as yup from 'yup';

// login config
export enum LoginFormKey {
  endpoint = 'endpoint',
  networkType = 'networkType',
}

export const loginFormSchema = yup.object({
  [LoginFormKey.endpoint]: yup.string().required(),
  [LoginFormKey.networkType]: yup.string().required(),
});

export const initialLoginValues = {
  [LoginFormKey.endpoint]: '',
  [LoginFormKey.networkType]: '',
};

export type TLoginValues = yup.Asserts<typeof loginFormSchema>;

// indexer register
export enum RegisterFormKey {
  name = 'name',
  proxyEndpoint = 'proxyEndpoint',
  amount = 'amount',
}

export const RegisterFormSchema = yup.object({
  [RegisterFormKey.name]: yup.string().required(),
  [RegisterFormKey.proxyEndpoint]: yup.string().required(),
  [RegisterFormKey.amount]: yup
    .number()
    .min(1000, 'Staking token should large than 1000 SQT')
    .required(),
});

export const initialRegisterValues = {
  [RegisterFormKey.name]: '',
  [RegisterFormKey.proxyEndpoint]: '',
  [RegisterFormKey.amount]: '',
};

export type TRegisterValues = yup.Asserts<typeof RegisterFormSchema>;

// config controllerItem
export enum ControllerFormKey {
  privateKey = 'privateKey',
}

export const ControllerFormSchema = yup.object({
  [ControllerFormKey.privateKey]: yup.string().required(),
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

export const ProjectFormSchema = yup.object({
  [ProjectFormKey.deploymentId]: yup.string().required(),
});

export const initialProjectValues = {
  [ProjectFormKey.deploymentId]: '',
};

// start project
export const StartProjectSchema = yup.object({
  [ProjectFormKey.indexerEndpoint]: yup.string().required(),
});

export const initialStartProjectValues = {
  [ProjectFormKey.indexerEndpoint]: '',
};

// pub project to ready
export const publishProjectSchema = yup.object({
  [ProjectFormKey.queryEndpoint]: yup.string().required(),
});

export const initialPublishProjectValues = {
  [ProjectFormKey.queryEndpoint]: '',
};

// stop project
