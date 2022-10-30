// Copyright 2020-2022 SubQuery Pte Ltd authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useMemo } from 'react';
import { Button, Table, TableTitle } from '@subql/components';

import { Plan, statusToTagState, usePAYGPlans } from 'hooks/paygHook';
import { ChannelStatus } from 'utils/queries';
import { createTagColumn, createTextColumn } from 'utils/table';

type Props = {
  deploymentId: string;
  onTerminate?: (id: string) => void;
};

type TableKey = 'consumer' | 'price' | 'spent' | 'deposit' | 'expiration' | 'action' | 'status';

const columns = [
  createTextColumn<TableKey>('consumer', 'CONSUMER'),
  createTextColumn<TableKey>('price', 'PRICE'),
  createTextColumn<TableKey>('spent', 'SPENT'),
  createTextColumn<TableKey>('deposit', 'REMAINING DEPOSIT'),
  createTextColumn<TableKey>('expiration', 'EXPIRATION'),
  createTagColumn<TableKey>('status', 'STATUS'),
  createTextColumn<TableKey>('action', 'ACTION'),
];

function plansToDatasource(plans: Plan[] | undefined) {
  if (!plans) return [];
  return plans.map((p) => ({
    consumer: p.consumer,
    price: '500 SQT',
    spent: `${p.spent} SQT`,
    deposit: `${p.total - p.spent} SQT`,
    expiration: '2 days', // TODO: need to calculate this
    status: statusToTagState(p.status),
  }));
}

export function PAYGPlan({ deploymentId, onTerminate }: Props) {
  const { plans, loading } = usePAYGPlans(deploymentId, ChannelStatus.OPEN);
  const dataSource = useMemo(() => plansToDatasource(plans), [plans]);

  const teminateBtn = (id: string) => (
    <Button
      type="link"
      size="medium"
      colorScheme="standard"
      title="Edit"
      onClick={() => onTerminate && onTerminate(id)}
    />
  );

  const actionColumn = {
    dataIndex: 'action',
    title: <TableTitle title="ACTION" />,
    render: teminateBtn,
  };

  return <Table tableProps={{ columns: [...columns, actionColumn], dataSource }} />;
}
