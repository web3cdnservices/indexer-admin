// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import * as yup from 'yup';

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
