// Copyright 2020-2022 SubQuery Pte Ltd authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Plan, statusToTagState } from 'hooks/paygHook';
import { createTagColumn, createTextColumn } from 'utils/table';

import prompts from '../prompts';

const { channels } = prompts.payg;

export enum TabbarItem {
  ONGOING,
  CLOSED,
}

type TableKey = 'consumer' | 'price' | 'spent' | 'deposit' | 'expiration' | 'status';

export const planColumns = [
  createTextColumn<TableKey>('consumer', 'CONSUMER'),
  createTextColumn<TableKey>('price', 'PRICE', 'The price of this flex plan'),
  createTextColumn<TableKey>(
    'spent',
    'SPENT',
    'The total amount that the consumer has spent so far'
  ),
  createTextColumn<TableKey>('deposit', 'REMAINING DEPOSIT'),
  createTextColumn<TableKey>(
    'expiration',
    'EXPIRATION',
    'The Flex Plan will end on the expiry date'
  ),
  createTagColumn<TableKey>('status', 'STATUS'),
];

export function plansToDatasource(id: string, plans: Plan[] | undefined) {
  if (!plans) return [];
  return plans.map((p) => ({
    consumer: p.consumer,
    price: '500 SQT',
    spent: `${p.spent} SQT`,
    deposit: `${p.total - p.spent} SQT`,
    expiration: '2 days', // TODO: need to calculate this
    status: statusToTagState(p.status),
    action: { status: p.status, id },
  }));
}

export const tabItems = [
  {
    // TODO: add icons
    label: channels.tabs.open,
  },
  {
    label: channels.tabs.closed,
  },
];
