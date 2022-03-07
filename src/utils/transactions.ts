// Copyright 2020-2022 SubQuery Pte Ltd authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ContractTransaction } from 'ethers';

import { ToastContext, ToastProps } from 'containers/toastContext';

export enum ActionType {
  unregister = 'unregister',
  configCntroller = 'configCntroller',
  addProject = 'addProject',
  removeProject = 'removeProject',
  configServices = 'configServices',
  startIndexing = 'startIndexing',
  readyIndexing = 'readyIndexing',
  stopIndexing = 'stropIndexing',
}

export function txLoadingToast(txHash: string): ToastProps {
  return { type: 'loading', text: `Processing transaction: ${txHash}` };
}

export function txSuccessToast(txHash: string): ToastProps {
  return { type: 'success', text: `Transaction completed: ${txHash}` };
}

export function txErrorToast(message: string): ToastProps {
  return { type: 'error', text: `Transaction failed: ${message}` };
}

export async function handleTransaction(
  tx: ContractTransaction,
  toastContext: ToastContext,
  onSuccess?: () => void,
  onError?: () => void
) {
  const { dispatchToast, closeToast } = toastContext;
  dispatchToast(txLoadingToast(tx.hash));

  const receipt = await tx.wait(1);
  if (!receipt.status) {
    onError && onError();
    dispatchToast(txErrorToast(tx.hash));
  } else {
    onSuccess && onSuccess();
    dispatchToast(txSuccessToast(tx.hash));
  }

  setTimeout(() => closeToast(), 2000);
}
