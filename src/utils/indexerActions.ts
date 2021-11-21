// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Signer } from '../hooks/web3Hook';
import { SDK } from '../containers/contractSdk';

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

export const indexerRegistry = (
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

    const metadata = '0xab3921276c8067fe0c82def3e5ecfd8447f1961bc85768c2a56e6bd26d3c0c55';

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

export const configController = (sdk: SDK, signer: Signer, controller: string | undefined) =>
  new Promise((resolve, reject) => {
    if (!sdk || !signer) {
      reject(ErrorMessages.sdkOrSignerError);
      return;
    }

    if (!controller) {
      reject(ErrorMessages.controllerError);
      return;
    }

    sdk.indexerRegistry.controllerToIndexer(controller).then((indexer) => {
      if (indexer === emptyControllerAccount) {
        sdk.indexerRegistry
          .connect(signer)
          .setControllerAccount(controller)
          .then(() => resolve(''))
          .catch((error) => reject(error.message));
      } else {
        reject(ErrorMessages.controllerExist);
      }
    });
  });

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
      .startIndexing(deploymentId)
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
      .stopIndexing(deploymentId)
      .then(() => resolve(''))
      // @ts-ignore
      .catch((error) => reject(error.message));
  });
