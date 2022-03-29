// Copyright 2020-2022 SubQuery Pte Ltd authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ContractTransaction } from 'ethers';
import { FormikHelpers, FormikValues } from 'formik';

import { Notification, notificationContext } from 'containers/notificationContext';

import { dismiss } from './notification';

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

const formatHash = (hash: string) => {
  const len = hash.length;
  return `${hash.substring(0, 15)}...${hash.substring(len - 16, len - 1)}`;
};

export function txLoadingNotification(txHash: string): Notification {
  return {
    type: 'info',
    title: 'Processing Transaction',
    message: `May take around 20s to be processed: ${formatHash(txHash)}`,
    dismiss: dismiss(50000, true),
  };
}

export function txSuccessNotification(): Notification {
  return {
    type: 'success',
    title: 'Transaction Succeed',
    message: 'Transaction processed',
    dismiss: dismiss(),
  };
}

export function txErrorNotification(message: string): Notification {
  return {
    type: 'danger',
    title: 'Transaction Failed',
    message: `${message}`,
    dismiss: dismiss(),
  };
}

export async function handleTransaction(
  tx: ContractTransaction,
  notificationContext: notificationContext,
  onSuccess?: () => void,
  onError?: () => void
) {
  const { dispatchNotification, removeNotification } = notificationContext;
  const loadingId = dispatchNotification(txLoadingNotification(tx.hash));

  try {
    const receipt = await tx.wait(1);
    if (!receipt.status) {
      onError && onError();
      dispatchNotification(txErrorNotification(tx.hash));
    } else {
      onSuccess && onSuccess();
      dispatchNotification(txSuccessNotification());
    }
    removeNotification(loadingId);
  } catch (e) {
    console.error('Transaction Failed:', e);
    // @ts-ignore
    dispatchNotification(txErrorNotification(e.message));
  }
}
