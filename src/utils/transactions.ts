// Copyright 2020-2022 SubQuery Pte Ltd authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ContractTransaction } from 'ethers';
import { FormikHelpers, FormikValues } from 'formik';

import { ToastContext, ToastProps } from 'containers/toastContext';

// TODO:  move types in type folder
export enum AccountAction {
  unregister = 'unregister',
  updateMetaData = 'updateMetadata',
  configCntroller = 'configCntroller',
}

export enum ProjectsAction {
  addProject = 'addProject',
}

export enum ProjectAction {
  StartIndexing = 'StartIndexing',
  AnnounceIndexing = 'AnnounceIndexing',
  RestartProject = 'RestartProject',
  AnnounceReady = 'AnnounceReady',
  StopProject = 'StopProject',
  AnnounceNotIndexing = 'AnnounceNotIndexing',
  StopIndexing = 'StopIndexing',
}

export type ModalAction = AccountAction | ProjectsAction | ProjectAction;

export type ClickAction = (type?: ModalAction) => void;
export type FormSubmit = (values: FormikValues, helper: FormikHelpers<FormikValues>) => void;

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

  try {
    const receipt = await tx.wait(1);
    if (!receipt.status) {
      onError && onError();
      dispatchToast(txErrorToast(tx.hash));
    } else {
      onSuccess && onSuccess();
      dispatchToast(txSuccessToast(tx.hash));
    }
  } catch (e) {
    console.error('Transaction Failed:', e);
    dispatchToast(txErrorToast(tx.hash));
  }

  setTimeout(() => closeToast(), 2000);
}
