// Copyright 2020-2022 SubQuery Pte Ltd authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { utils } from 'ethers';

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
export async function indexerRequestApprove(sdk: SDK, signer: Signer, amount: string | undefined) {
  if (!sdk || !signer) {
    throw new Error(ErrorMessages.sdkOrSignerError);
  }
  if (!amount) {
    throw new Error(ErrorMessages.amountError);
  }

  const tx = await sdk.sqToken
    .connect(signer)
    .increaseAllowance(sdk.staking.address, utils.parseEther(amount));
  return tx;
}

export async function indexerRegistry(
  sdk: SDK,
  signer: Signer,
  amount: string | undefined,
  metadata: string,
  commissionRate: number
) {
  if (!sdk || !signer) {
    throw new Error(ErrorMessages.sdkOrSignerError);
  }
  if (!amount) {
    throw new Error(ErrorMessages.amountError);
  }

  const overrides = { gasLimit: '1300000', type: 0 };
  console.log(amount.toString(), metadata, commissionRate);

  const tx = await sdk.indexerRegistry
    .connect(signer)
    .registerIndexer(utils.parseEther(amount), metadata, commissionRate, overrides);
  return tx;
}

export async function updateMetadata(sdk: SDK, signer: Signer, metadata: string) {
  if (!sdk || !signer) {
    throw new Error(ErrorMessages.sdkOrSignerError);
  }

  const tx = await sdk.indexerRegistry.connect(signer).updateMetadata(metadata);
  return tx;
}

export async function unRegister(sdk: SDK, signer: Signer) {
  if (!sdk || !signer) {
    throw new Error(ErrorMessages.sdkOrSignerError);
  }

  const tx = sdk.indexerRegistry.connect(signer).unregisterIndexer({ gasLimit: '1000000' });
  return tx;
}

export async function configController(sdk: SDK, signer: Signer, controller: string | undefined) {
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
}

export async function startIndexing(sdk: SDK, signer: Signer, deploymentId: string | undefined) {
  if (!sdk || !signer) {
    throw new Error(ErrorMessages.sdkOrSignerError);
  }
  if (!deploymentId) {
    throw new Error(ErrorMessages.deploymentIdError);
  }

  const tx = await sdk.queryRegistry.connect(signer).startIndexing(cidToBytes32(deploymentId));
  return tx;
}

export async function readyIndexing(sdk: SDK, signer: Signer, deploymentId: string | undefined) {
  if (!sdk || !signer) {
    throw new Error(ErrorMessages.sdkOrSignerError);
  }
  if (!deploymentId) {
    throw new Error(ErrorMessages.deploymentIdError);
  }

  const tx = await sdk.queryRegistry
    .connect(signer)
    .updateIndexingStatusToReady(cidToBytes32(deploymentId));
  return tx;
}

export async function stopIndexing(sdk: SDK, signer: Signer, deploymentId: string | undefined) {
  if (!sdk || !signer) {
    throw new Error(ErrorMessages.sdkOrSignerError);
  }
  if (!deploymentId) {
    throw new Error(ErrorMessages.deploymentIdError);
  }

  const tx = await sdk.queryRegistry.connect(signer).stopIndexing(cidToBytes32(deploymentId));
  return tx;
}
