// Copyright 2020-2022 SubQuery Pte Ltd authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useEffect, useState } from 'react';
import { useLazyQuery, useMutation } from '@apollo/client';
import { isUndefined } from 'lodash';

import ModalView from 'components/modalView';
import { Text } from 'components/primary';
import StatusLabel from 'components/statusLabel';
import { useLoading } from 'containers/loadingContext';
import { useIsIndexer } from 'hooks/indexerHook';
import { CHANNEL_CHECKPOINT, CHANNEL_CLOSE, GET_CHANNELS } from 'utils/queries';

import {
  ChannelItemContainer,
  Container,
  ContentContainer,
  HeaderContainer,
  HeaderItem,
  ItemContainer,
} from './styles';
import { ChannelAction, ChannelDetail, Status, statusColor, statusText } from './types';

const Payg = () => {
  const isIndexer = useIsIndexer();
  const { setPageLoading } = useLoading();
  const [getChannelList, { data }] = useLazyQuery(GET_CHANNELS, { fetchPolicy: 'network-only' });
  const [checkpointRequest, { loading: checkpointLoading }] = useMutation(CHANNEL_CHECKPOINT);
  const [closeRequest, { loading: closeLoading }] = useMutation(CHANNEL_CLOSE);
  const [visible, setVisible] = useState(false);
  const [channelDetail, setChannelDetail] = useState<ChannelDetail>({
    id: '',
    status: Status.FINALIZED,
    deploymentId: '',
    consumer: '',
    total: '',
    spent: '',
    onchain: '',
    price: '',
    expirationAt: 0,
    challengeAt: 0,
  });

  const onModalClose = () => {
    setVisible(false);
  };

  useEffect(() => {
    setPageLoading(isUndefined(data));
  }, [data]);

  useEffect(() => {
    setPageLoading(true);
    getChannelList();
  }, []);

  const channelShow = (newChannel: ChannelDetail) => {
    setChannelDetail(newChannel);
    setVisible(true);
  };

  const betterShow = (s: string) => {
    return ''.concat(s.substring(0, 8), '...', s.substring(s.length - 6, s.length));
  };

  const steps = {
    [ChannelAction.Checkpoint]: [
      {
        index: 0,
        title: channelDetail.id,
        desc: channelDetail.deploymentId,
        buttonTitle: 'Checkpoint',
        onClick: async () => {
          await checkpointRequest({ variables: { id: channelDetail.id } });
          setVisible(false);
        },
      },
    ],
  };

  const renderChannels = () => {
    if (isUndefined(data)) return null;
    return (
      <ContentContainer>
        <HeaderContainer>
          <Text size={45}>State Channels</Text>
        </HeaderContainer>
        <HeaderContainer>
          <HeaderItem pl={15} flex={4}>
            <Text>ID</Text>
          </HeaderItem>
          <HeaderItem flex={6}>
            <Text>Deployment</Text>
          </HeaderItem>
          <HeaderItem flex={2}>
            <Text>Total</Text>
          </HeaderItem>
          <HeaderItem flex={2}>
            <Text>Spent</Text>
          </HeaderItem>
          <HeaderItem flex={2}>
            <Text>Price</Text>
          </HeaderItem>
          <HeaderItem flex={2}>
            <Text>Status</Text>
          </HeaderItem>
        </HeaderContainer>
        {data?.channels.map((props: ChannelDetail) => (
          <ChannelItemContainer onClick={() => channelShow(props)}>
            <ItemContainer pl={15} flex={4}>
              <Text fw="600" size={18}>
                {betterShow(props.id)}
              </Text>
            </ItemContainer>
            <ItemContainer flex={6}>
              <Text>{betterShow(props.deploymentId)}</Text>
            </ItemContainer>
            <ItemContainer flex={2}>
              <Text>{props.total}</Text>
            </ItemContainer>
            <ItemContainer flex={2}>
              <Text>{props.spent}</Text>
            </ItemContainer>
            <ItemContainer flex={2}>
              <Text>{props.price}</Text>
            </ItemContainer>
            <ItemContainer flex={2}>
              <StatusLabel text={statusText[props.status]} color={statusColor[props.status]} />
            </ItemContainer>
          </ChannelItemContainer>
        ))}
      </ContentContainer>
    );
  };

  return (
    <Container>
      {isIndexer && renderChannels()}
      <ModalView
        visible={visible}
        title="Channel Detail"
        onClose={onModalClose}
        steps={steps.Checkpoint}
      />
    </Container>
  );
};

export default Payg;
