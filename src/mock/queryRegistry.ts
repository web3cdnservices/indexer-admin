// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { JsonRpcSigner } from '@ethersproject/providers';
import { ContractSDK } from '@subql/contract-sdk';

const metadata = '0xcec921276c8067fe0c82def3e5ecfd8447f1961bc85768c2a56e6bd26d3c0c55';
const version = '0xaec921276c8067fe0c82def3e5ecfd8447f1961bc85768c2a56e6bd26d3c0c55';
const deploymentId = '0xbec921276c8067fe0c82def3e5ecfd8447f1961bc85768c2a56e6bd26d3c0c55';

export const createQueryProject = (sdk: ContractSDK, signer: JsonRpcSigner) => {
  sdk.queryRegistry.connect(signer).createQueryProject(metadata, version, deploymentId);
};
