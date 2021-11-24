// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

export enum TransactionType {
  unregister = 'unregister',
  configCntroller = 'configCntroller',
  startIndexing = 'startIndexing',
  readyIndexing = 'readyIndexing',
  stopIndexing = 'stropIndexing',
}

export type TransactionKey = {
  amount?: string;
  controllerAccount?: string;
  deploymentID?: string;
  Status?: string;
};

// TODO: support config steps
export const transactionSchema = {
  [TransactionType.configCntroller]: [
    {
      title: 'Controller Account',
      key: 'controllerAccount',
    },
  ],
  [TransactionType.startIndexing]: [
    {
      title: 'Deployment ID',
      key: 'deploymentID',
    },
  ],
  [TransactionType.readyIndexing]: [
    {
      title: 'Deployment ID',
      key: 'deploymentID',
    },
  ],
  [TransactionType.stopIndexing]: [
    {
      title: 'Deployment ID',
      key: 'deploymentID',
    },
  ],
  [TransactionType.unregister]: [],
};
