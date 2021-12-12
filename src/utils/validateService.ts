// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { SubqueryNetwork } from '@subql/contract-sdk';
import { isValidPrivate, toBuffer } from 'ethereumjs-util';
import { FormikHelpers } from 'formik';

import { LoginFormKey, TLoginValues } from 'types/schemas';

import { createApolloClient, saveClientUri } from './apolloClient';
import Config from './config';
import { GET_ACCOUNT_METADATA } from './queries';

// endpoints validation
export function validateCoordinatorService(
  url: string,
  networkType: string,
  helper: FormikHelpers<TLoginValues>
) {
  helper.setStatus({ loading: true });
  return new Promise<{ indexer: string; network: SubqueryNetwork }>((resolve) => {
    createApolloClient(url)
      .query({ query: GET_ACCOUNT_METADATA })
      .then(({ data }) => {
        if (data && data.accountMetadata) {
          const { indexer, network, wsEndpoint } = data.accountMetadata;
          if (network !== networkType) {
            helper.setErrors({
              [LoginFormKey.networkType]: `Inconsistent network type with coordinator service: ${network}`,
            });
          } else {
            Config.getInstance().config({ network, wsEndpoint });
            saveClientUri(url);
            resolve({ indexer, network });
          }
        }
        helper.setStatus({ loading: false });
      })
      .catch(() => {
        helper.setStatus({ loading: false });
        helper.setErrors({ [LoginFormKey.endpoint]: 'Invalid service endpoint' });
      });
  });
}

// fields validation
export const validatePrivateKey = (privateKey: string): string => {
  try {
    if (!privateKey.startsWith('0x')) {
      return 'Private key must start with 0x';
    }
    if (!isValidPrivate(toBuffer(privateKey))) {
      return 'Invalid private key';
    }
  } catch (_) {
    return 'Invalid private key';
  }
  return '';
};
