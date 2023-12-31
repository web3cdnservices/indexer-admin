// Copyright 2020-2022 SubQuery Pte Ltd authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { FC, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { Spinner, Tag } from '@subql/components';
import { isUndefined } from 'lodash';

import Avatar from 'components/avatar';
import { Text } from 'components/primary';
import StatusLabel from 'components/statusLabel';
import { useAccount } from 'containers/account';
import { useDeploymentStatus, useIsOnline } from 'hooks/projectHook';
import { ProjectDetails } from 'pages/project-details/types';
import { cidToBytes32 } from 'utils/ipfs';
import { calculateProgress } from 'utils/project';

import { OnlineStatus, statusColor, statusText } from '../constant';
import { ItemContainer, ProfileContainer, Progress, ProjectItemContainer } from '../styles';

type Props = ProjectDetails;

const ProjectItem: FC<Props> = (props) => {
  const { id, details, metadata } = props;

  const { account } = useAccount();
  const history = useHistory();
  const status = useDeploymentStatus(id);
  const onlineStatus = useIsOnline({
    deploymentId: id,
    indexer: account || '',
  });
  const progress = useMemo(() => {
    if (!metadata) return 0;
    const { targetHeight, lastProcessedHeight } = metadata;
    return calculateProgress(targetHeight, lastProcessedHeight);
  }, [metadata]);

  const pushDetailPage = () => history.push(`/project/${id}`, { data: { ...props, status } });

  return (
    <ProjectItemContainer onClick={pushDetailPage}>
      <ItemContainer pl={15} flex={7}>
        <Avatar address={cidToBytes32(id)} size={70} />
        <ProfileContainer>
          <Text fw="600" size={18}>
            {details.name}
          </Text>
          <Text size={13} mt={5}>
            {id}
          </Text>
        </ProfileContainer>
      </ItemContainer>
      <ItemContainer flex={6}>
        <Progress progress={progress / 100} />
      </ItemContainer>
      <ItemContainer flex={6}>
        <Tag
          state={onlineStatus ? 'success' : 'error'}
          style={{ height: '22px', lineHeight: '18px' }}
        >
          {onlineStatus ? OnlineStatus.online : OnlineStatus.offline}
        </Tag>
      </ItemContainer>
      <ItemContainer flex={2}>
        {!isUndefined(status) ? (
          <StatusLabel text={statusText[status]} color={statusColor[status]} />
        ) : (
          <Spinner />
        )}
      </ItemContainer>
    </ProjectItemContainer>
  );
};

export default ProjectItem;
