// Copyright 2020-2022 SubQuery Pte Ltd authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useMemo, useState } from 'react';
import { Button, Table, TableTitle, Tabs } from '@subql/components';

import { Text } from 'components/primary';
import { ChannelStatus, usePAYGPlans } from 'hooks/paygHook';

import prompts from '../prompts';
import {
  planColumns,
  plansToDatasource,
  TabbarItem,
  tabItems,
  tabToStatus,
} from './paygDatasource';
import { PlansContainer } from './styles';

const { channels } = prompts.payg;

type Props = {
  deploymentId: string;
  onTerminate?: (id: string) => void;
};

export function PAYGPlan({ deploymentId, onTerminate }: Props) {
  const [tabItem, setTabItem] = useState(TabbarItem.ONGOING);
  const { plans, getPlans } = usePAYGPlans(deploymentId);
  const dataSource = useMemo(
    () => plansToDatasource(deploymentId, plans, tabItem),
    [plans, tabItem]
  );

  const onTabChange = (tabValue: TabbarItem) => {
    const status = tabToStatus(tabValue);
    setTabItem(tabValue);
    getPlans(deploymentId, status);
  };

  const teminateBtn = ({ id, status }: { id: string; status: ChannelStatus }) => (
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

  return (
    <PlansContainer>
      <Text mb={10} size={20}>
        {channels.title}
      </Text>
      <Tabs tabs={tabItems} onTabClick={onTabChange} />
      <Table tableProps={{ columns: [...planColumns, actionColumn], dataSource }} />
    </PlansContainer>
  );
}
