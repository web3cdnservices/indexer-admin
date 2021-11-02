// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Signer } from '../hooks/web3Hook';
import { SDK } from '../containers/contractSdk';

export const emptyControllerAccount = '0x0000000000000000000000000000000000000000';

const ErrorMessages = {
  sdkOrSignerError: 'Contract SDK or Signer not initialised',
  controllerExist: 'Controller account is used by an indexer already',
  deploymentIdError: 'Invalid deploymentId provided',
};

export const indexerRegistry = (sdk: SDK, signer: Signer, amount: number): Promise<string> =>
  new Promise((resolve, reject) => {
    if (!sdk || !signer) {
      reject(ErrorMessages.sdkOrSignerError);
      return;
    }

    sdk.indexerRegistry
      .connect(signer)
      .registerIndexer(amount)
      .then(() => resolve(''))
      .catch((error) => reject(error.message));

    // TODO: handle these 2 actions
    // sdk.sqToken
    //   .connect(signer)
    //   .approve(sdk.staking.address, amount)
    //   .then(() => {
    //     console.log('>>>resolved');
    //     resolve('');
    //   })
    //   .catch((error) => reject(error.message));
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

export const configController = (sdk: SDK, signer: Signer, controller: string) =>
  new Promise((resolve, reject) => {
    if (!sdk || !signer) {
      reject(ErrorMessages.sdkOrSignerError);
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

export const startIndexing = (sdk: SDK, signer: Signer, deploymentId: string): Promise<string> =>
  new Promise((resolve, reject) => {
    if (!sdk || !signer) {
      reject(ErrorMessages.sdkOrSignerError);
      return;
    }

    if (!deploymentId) {
      reject(ErrorMessages.deploymentIdError);
      return;
    }

    sdk.indexerRegistry
      .connect(signer)
      .startIndexing(deploymentId)
      .then(() => resolve(''))
      // @ts-ignore
      .catch((error) => reject(error.message));
  });

export const stopIndexing = (sdk: SDK, signer: Signer, deploymentId: string): Promise<string> =>
  new Promise((resolve, reject) => {
    if (!sdk || !signer) {
      reject(ErrorMessages.sdkOrSignerError);
      return;
    }

    if (!deploymentId) {
      reject(ErrorMessages.deploymentIdError);
      return;
    }

    sdk.indexerRegistry
      .connect(signer)
      .stopIndexing(deploymentId)
      .then(() => resolve(''))
      // @ts-ignore
      .catch((error) => reject(error.message));
  });
