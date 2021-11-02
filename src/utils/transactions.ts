// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

export enum TransactionType {
  registry = 'registry',
  configCntroller = 'configCntroller',
  startIndexing = 'startIndexing',
  stopIndexing = 'stropIndexing',
  reportStatus = 'reportStatus',
}

export const transactionSchema = {
  [TransactionType.registry]: [
    {
      title: 'Amount',
    },
  ],
  [TransactionType.configCntroller]: [
    {
      title: 'Controller Account',
    },
  ],
  [TransactionType.startIndexing]: [
    {
      title: 'Deployment ID',
    },
  ],
  [TransactionType.stopIndexing]: [
    {
      title: 'Deployment ID',
    },
  ],
  [TransactionType.reportStatus]: [
    {
      title: 'Deployment ID',
    },
    {
      title: 'Status',
    },
  ],
};
