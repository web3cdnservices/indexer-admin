// Copyright 2020-2022 SubQuery Pte Ltd authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { FC, useState } from 'react';
import { useParams } from 'react-router';
import { NetworkStatus } from '@apollo/client';
import { Tag, Typography } from '@subql/components';
import { useMount } from 'ahooks';

import UptimeBar from 'components/uptimeBar';
import { useAccount } from 'containers/account';
import { useIsOnline } from 'hooks/projectHook';
import { getRequestHistory, IGetRequeestHistory } from 'utils/queries';

const ProjectUptime: FC = () => {
  const { id = '' } = useParams<{ id: string }>();
  const { account } = useAccount();
  const [history, setHistory] = useState<IGetRequeestHistory['getRequestHistory']['records']>([]);
  const onlineStatus = useIsOnline({
    deploymentId: id,
    indexer: account || '',
  });

  const getHistory = async (): Promise<void> => {
    if (!account) return;
    const res = await getRequestHistory({
      deploymentId: id,
      indexer: account,
    });

    if (res.status === NetworkStatus.ready) {
      setHistory(res.data.getRequestHistory.records);
    }
  };

  useMount(() => {
    getHistory();
  });

  return (
    <div style={{ marginTop: '23px' }}>
      <UptimeBar
        header={
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="large" weight={600} style={{ marginRight: '16px' }}>
              Deployment Uptime
            </Typography>

            <Tag
              state={onlineStatus ? 'success' : 'error'}
              style={{ height: '22px', lineHeight: '18px' }}
            >
              {onlineStatus ? 'You are Connectable' : 'You are not Connectable'}
            </Tag>
          </div>
        }
        uptimeData={history}
      />
    </div>
  );
};
export default ProjectUptime;