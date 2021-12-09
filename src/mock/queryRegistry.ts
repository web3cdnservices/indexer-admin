// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { JsonRpcSigner } from '@ethersproject/providers';
import { ContractSDK } from '@subql/contract-sdk';
import * as crypto from 'crypto';

import { bytes32ToCid } from 'utils/ipfs';

// For testing

// TODO: Change `metadata` to a valid project value, which can get the name and other properties
const metadata = '0xcec921276c8067fe0c82def3e5ecfd8447f1961bc85768c2a56e6bd26d3c0c55';
const version = '0xaec921276c8067fe0c82def3e5ecfd8447f1961bc85768c2a56e6bd26d3c0c55';

const generateDepolymentID = () => `0x${crypto.randomBytes(32).toString('hex')}`;

const storageKey = 'test_projects';

const saveItemToLocal = (id: string) => {
  const ids = localStorage.getItem(storageKey);
  localStorage.setItem(storageKey, `${ids ?? ''}${id},`);
};

// FIXME: rmeove this one later
export const getProjectIds = () => {
  const ids = localStorage.getItem(storageKey);
  if (!ids) return [];
  return ids.split(',');
};

export const createQueryProject = (sdk?: ContractSDK, signer?: JsonRpcSigner) => {
  if (sdk && signer) {
    const deploymentID = generateDepolymentID();
    console.log('>>>cid:', bytes32ToCid(deploymentID));
    sdk.queryRegistry
      .connect(signer)
      .createQueryProject(metadata, version, deploymentID)
      .then(() => saveItemToLocal(deploymentID));
  }
};
