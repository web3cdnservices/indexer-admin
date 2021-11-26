// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { FC } from 'react';
import styled from 'styled-components';
import { Hashicon } from '@emeraldpay/hashicon-react';
import StatusLabel from './statusLabel';
import { Text, Button } from './primary';

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
  onClick: () => void;
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
  onClick,
  loading,
  account,
  status,
}) => (
  <Container>
    <HeaderContainer>
      <MainTitleContainer>
        <Text size={30} fw="500" mr={20}>
          {title}
        </Text>
        {!!status && <StatusLabel text={status} />}
      </MainTitleContainer>
      {!!account && !!buttonTitle && (
        <Button title={buttonTitle} loading={loading} width={200} onClick={onClick} />
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
          <Button title={buttonTitle} loading={loading} width={200} onClick={onClick} />
        )}
      </DescContainer>
    )}
  </Container>
);

export default AccountCard;
