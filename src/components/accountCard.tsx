// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { FC } from 'react';
import { Hashicon } from '@emeraldpay/hashicon-react';
import styled from 'styled-components';

import { ActionType } from 'utils/transactions';

import { Label, SButton, Text } from './primary';
import StatusLabel from './statusLabel';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 1000px;
  min-height: 250px;
  width: 70%;
  border: thin solid;
  border-color: lightgray;
  border-radius: 15px;
  padding: 40px;
  margin-bottom: 30px;
  :hover {
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  }
`;

const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 30px;
`;

const MainTitleContainer = styled.div`
  display: flex;
  align-items: center;
`;

const ContentContainer = styled.div`
  display: flex;
  align-items: center;
`;

const DescContainer = styled.div<{ ml?: number }>`
  display: flex;
  width: 80%;
  flex-direction: column;
  margin-left: ${({ ml }) => ml ?? 0}px;
`;

type Props = {
  title: string;
  desc: string;
  buttonTitle: string;
  type: ActionType;
  onClick: (type: ActionType) => void;
  loading?: boolean;
  name?: string;
  account?: string;
  status?: string;
};

const AccountCard: FC<Props> = ({
  title,
  desc,
  buttonTitle,
  name,
  type,
  onClick,
  loading,
  account,
  status,
}) => (
  <Container>
    <HeaderContainer>
      <MainTitleContainer>
        <Label size={30} fw="500" mr={20}>
          {title}
        </Label>
        {!!status && <StatusLabel text={status} />}
      </MainTitleContainer>
      {!!account && !!buttonTitle && (
        <SButton width={250} title={buttonTitle} loading={loading} onClick={() => onClick(type)} />
      )}
    </HeaderContainer>
    {account ? (
      <ContentContainer>
        <Hashicon hasher="keccak" value={account ?? ''} size={100} />
        <DescContainer ml={20}>
          <Text>{name}</Text>
          <Text mt={10}>{account}</Text>
          <Text mt={10}>{desc}</Text>
        </DescContainer>
      </ContentContainer>
    ) : (
      <DescContainer>
        <Text color="gray" size={15} mb={30}>
          {desc}
        </Text>
        {!!buttonTitle && (
          <SButton
            width={200}
            title={buttonTitle}
            loading={loading}
            onClick={() => onClick(type)}
          />
        )}
      </DescContainer>
    )}
  </Container>
);

export default AccountCard;
