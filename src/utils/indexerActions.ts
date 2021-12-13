// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { SDK } from 'containers/contractSdk';
import { Signer } from 'hooks/web3Hook';

import { cidToBytes32 } from './ipfs';

export const emptyControllerAccount = '0x0000000000000000000000000000000000000000';

const ErrorMessages = {
  sdkOrSignerError: 'Contract SDK or Signer not initialised',
  controllerExist: 'Controller account is used by an indexer already',
  deploymentIdError: 'Invalid deploymentId provided',
  amountError: 'Amount can not be empty',
  controllerError: 'Controller can not be empty',
};

// TODO: refactor
export const indexerRequestApprove = (
  sdk: SDK,
  signer: Signer,
  amount: string | undefined
): Promise<string> =>
  new Promise((resolve, reject) => {
    if (!sdk || !signer) {
      reject(ErrorMessages.sdkOrSignerError);
      return;
    }

    if (!amount) {
      reject(ErrorMessages.amountError);
      return;
    }

    sdk.sqToken
      .connect(signer)
      .approve(sdk.staking.address, amount)
      .then(() => resolve(''))
      .catch((error) => reject(error.message));
  });

// FIXME: remove this after register finished
const testMetadat = '0xab3921276c8067fe0c82def3e5ecfd8447f1961bc85768c2a56e6bd26d3c0c55';

export const indexerRegistry = (
  sdk: SDK,
  signer: Signer,
  amount: string | undefined,
  metadata = testMetadat
): Promise<string> =>
  new Promise((resolve, reject) => {
    if (!sdk || !signer) {
      reject(ErrorMessages.sdkOrSignerError);
      return;
    }

    if (!amount) {
      reject(ErrorMessages.amountError);
      return;
    }

    sdk.indexerRegistry
      .connect(signer)
      .registerIndexer(amount, metadata)
      .then(() => resolve(''))
      .catch((error) => reject(error.message));
  });

export const unRegister = (sdk: SDK, signer: Signer) =>
  new Promise((resolve, reject) => {
    if (!sdk || !signer) {
      reject(ErrorMessages.sdkOrSignerError);
      return;
    }

    sdk.indexerRegistry
      .connect(signer)
      .unregisterIndexer()
      .then(() => resolve(''))
      .catch((error) => reject(error.message));
  });

export const configController = async (
  sdk: SDK,
  signer: Signer,
  controller: string | undefined
) => {
  if (!sdk || !signer) {
    throw new Error(ErrorMessages.sdkOrSignerError);
  }
  if (!controller) {
    throw new Error(ErrorMessages.controllerError);
  }

  const indexer = await sdk.indexerRegistry.controllerToIndexer(controller);
  if (indexer !== emptyControllerAccount) {
    throw new Error(ErrorMessages.controllerExist);
  }

  const tx = await sdk.indexerRegistry.connect(signer).setControllerAccount(controller);
  return tx;
};

export const startIndexing = (
  sdk: SDK,
  signer: Signer,
  deploymentId: string | undefined
): Promise<string> =>
  new Promise((resolve, reject) => {
    if (!sdk || !signer) {
      reject(ErrorMessages.sdkOrSignerError);
      return;
    }

    if (!deploymentId) {
      reject(ErrorMessages.deploymentIdError);
      return;
    }

    sdk.queryRegistry
      .connect(signer)
      .startIndexing(cidToBytes32(deploymentId))
      .then(() => resolve(''))
      // @ts-ignore
      .catch((error) => reject(error.message));
  });

export const readyIndexing = (
  sdk: SDK,
  signer: Signer,
  deploymentId: string | undefined
): Promise<string> =>
  new Promise((resolve, reject) => {
    if (!sdk || !signer) {
      reject(ErrorMessages.sdkOrSignerError);
      return;
    }

    if (!deploymentId) {
      reject(ErrorMessages.deploymentIdError);
      return;
    }

    sdk.queryRegistry
      .connect(signer)
      .updateIndexingStatusToReady(cidToBytes32(deploymentId), Date.now())
      .then(() => resolve(''))
      // @ts-ignore
      .catch((error) => reject(error.message));
  });

export const stopIndexing = (
  sdk: SDK,
  signer: Signer,
  deploymentId: string | undefined
): Promise<string> =>
  new Promise((resolve, reject) => {
    if (!sdk || !signer) {
      reject(ErrorMessages.sdkOrSignerError);
      return;
    }

    if (!deploymentId) {
      reject(ErrorMessages.deploymentIdError);
      return;
    }

    sdk.queryRegistry
      .connect(signer)
      .stopIndexing(cidToBytes32(deploymentId))
      .then(() => resolve(''))
      // @ts-ignore
      .catch((error) => reject(error.message));
  });
