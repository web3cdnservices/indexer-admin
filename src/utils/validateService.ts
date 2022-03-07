// Copyright 2020-2022 SubQuery Pte Ltd authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable */
import { isValidPrivate, toBuffer } from 'ethereumjs-util';
import { isUndefined } from 'lodash';
import { createApolloClient } from './apolloClient';
import { GET_QUERY_METADATA } from './queries';

// verify query service endpoint
export async function verifyQueryService(url: string) {
  const data = await createApolloClient(`${url}`).query({ query: GET_QUERY_METADATA });
  // @ts-ignore
  // eslint-disable-next-line dot-notation
  return data['_metadata'];
}

export function isMetaMaskRejectError(e: Error): boolean {
  return e.message.includes('metamask');
}

// fields validation
export function validatePrivateKey(privateKey: string): string {
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
}

export function isFalse(value: boolean | string | undefined) {
  return !isUndefined(value) && !value;
}
