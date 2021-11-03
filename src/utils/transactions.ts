// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

export enum TransactionType {
  approve = 'approve',
  registry = 'registry',
  configCntroller = 'configCntroller',
  startIndexing = 'startIndexing',
  stopIndexing = 'stropIndexing',
  reportStatus = 'reportStatus',
}

export type TransactionKey = {
  amount?: string;
  controllerAccount?: string;
  deploymentID?: string;
  Status?: string;
};

export const transactionSchema = {
  [TransactionType.approve]: [
    {
      title: 'Amount',
      key: 'amount',
    },
  ],
  [TransactionType.registry]: [
    {
      title: 'Amount',
      key: 'amount',
    },
  ],
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
  [TransactionType.stopIndexing]: [
    {
      title: 'Deployment ID',
      key: 'deploymentID',
    },
  ],
  [TransactionType.reportStatus]: [
    {
      title: 'Deployment ID',
      key: 'deploymentID',
    },
    {
      title: 'Status',
      key: 'status',
    },
  ],
};
