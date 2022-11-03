// Copyright 2020-2022 SubQuery Pte Ltd authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ChannelStatus, Plan } from 'hooks/paygHook';
import { createTagColumn, createTextColumn } from 'utils/table';

import prompts from '../prompts';

const { channels } = prompts.payg;

export enum TabbarItem {
  ONGOING,
  EXPIRED,
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

export function getTagState(tabItem: TabbarItem) {
  switch (tabItem) {
    case TabbarItem.ONGOING:
      return { state: 'success', text: 'Active' };
    case TabbarItem.EXPIRED:
      return { state: 'info', text: 'Expired' };
    default:
      return { state: 'info', text: 'Completed' };
  }
}

export function statusToTabItem(status: ChannelStatus, expiration: string): TabbarItem {
  const isExpired = new Date(expiration).getTime() < Date.now();
  if (isExpired) {
    return TabbarItem.EXPIRED;
  }

  switch (status) {
    case ChannelStatus.OPEN:
      return TabbarItem.ONGOING;
    default:
      return TabbarItem.CLOSED;
  }
}

export function tabToStatus(tabItem: TabbarItem): ChannelStatus {
  switch (tabItem) {
    case TabbarItem.ONGOING:
    case TabbarItem.EXPIRED:
      return ChannelStatus.OPEN;
    default:
      return ChannelStatus.FINALIZED;
  }
}

export function plansToDatasource(id: string, plans: Plan[] | undefined, tabItem: TabbarItem) {
  if (!plans) return [];
  // TODO: update `price` from onchain data
  return plans
    .filter((p) => statusToTabItem(p.status, p.expiredAt) === tabItem)
    .map((p) => ({
      consumer: p.consumer,
      price: '500 SQT',
      spent: `${p.spent} SQT`,
      deposit: `${p.total - p.spent} SQT`,
      expiration: new Date(p.expiredAt).toLocaleDateString(),
      status: getTagState(tabItem),
      action: { status: p.status, id },
    }));
}

export const tabItems = [
  {
    // TODO: add icons
    label: channels.tabs.open,
  },
  {
    // TODO: add icons
    label: channels.tabs.expired,
  },
  {
    label: channels.tabs.closed,
  },
];
