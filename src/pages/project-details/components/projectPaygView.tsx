// Copyright 2020-2022 SubQuery Pte Ltd authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { FC } from 'react';
import { Tag } from '@subql/react-ui';
import styled from 'styled-components';

import { Button, Text } from 'components/primary';

import { ButtonItem } from '../config';
import { ActionContainer, CardContainer } from '../styles';
import { PaygStatus } from '../types';

const ContentContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  margin-right: 50px;
`;

const ServiceContaineer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 200px;
  margin-right: 30px;
`;

const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
`;

type Props = {
  actionItems: ButtonItem[];
  status?: PaygStatus;
  price?: string;
  expiration?: number;
  threshold?: number;
  overflow?: number;
};

const ProjectPaygView: FC<Props> = ({
  actionItems,
  status,
  price,
  expiration,
  threshold,
  overflow,
}) => (
  <CardContainer>
    <ContentContainer>
      <ServiceContaineer>
        <HeaderContainer>
          <Text mr={20} fw="500">
            PAYG price: {price}SQT
          </Text>
          {status === PaygStatus.Open ? (
            <Tag text="Open" state="success" />
          ) : (
            <Tag text="Close" state="error" />
          )}
        </HeaderContainer>
        {status === PaygStatus.Open ? (
          <Text size={15} color="gray" mt={10}>
            Minimum expiration time: {expiration} seconds
          </Text>
        ) : (
          <Text size={15} color="gray" mt={10}>
            {' '}
          </Text>
        )}
        {status === PaygStatus.Open ? (
          <Text size={15} color="gray" mt={10}>
            Automatic checkpoint to chain: {threshold} times
          </Text>
        ) : (
          <Text size={15} color="gray" mt={10}>
            {' '}
          </Text>
        )}
        {status === PaygStatus.Open ? (
          <Text size={15} color="gray">
            Maximum allowed conflict: {overflow} times
          </Text>
        ) : (
          <Text size={15} color="gray">
            {' '}
          </Text>
        )}
      </ServiceContaineer>
    </ContentContainer>
    <ActionContainer>
      {actionItems.map(({ title, action }) => (
        <Button mt={10} key={title} width={265} title={title} onClick={action} />
      ))}
    </ActionContainer>
  </CardContainer>
);

export default ProjectPaygView;
