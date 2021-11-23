// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { FC } from 'react';
import styled from 'styled-components';
import { Hashicon } from '@emeraldpay/hashicon-react';
import StatusLabel from './statusLabel';
import { Text } from './primary';
// import Balance from './balance';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 1000px;
  min-height: 130px;
  width: 70%;
  border: thin solid;
  border-color: lightgray;
  border-radius: 15px;
  padding: 30px;
`;

const MainTitleContainer = styled.div`
  display: flex;
  align-items: center;
`;

const ContentContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 20px 0px;
`;

const DescContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 20px;
`;

type Props = {
  title: string;
  desc: string;
  account: string | undefined | null;
  status?: string;
};

const AccountCard: FC<Props> = ({ title, desc, account, status }) => {
  return (
    <Container>
      <MainTitleContainer>
        <Text size={30} fw="500" mr={20}>
          {title}
        </Text>
        {!!status && <StatusLabel text={status} />}
      </MainTitleContainer>
      <ContentContainer>
        <Hashicon hasher="keccak" value={account ?? ''} size={100} />
        <DescContainer>
          <Text>Indexer Name</Text>
          <Text mt={10}>{account ?? ''}</Text>
          <Text mt={10}>{desc}</Text>
        </DescContainer>
      </ContentContainer>
    </Container>
  );
};

export default AccountCard;
