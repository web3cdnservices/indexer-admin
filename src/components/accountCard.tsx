// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import styled from '@emotion/styled';
import { FC } from 'react';
import Balance from './balance';

const Container = styled.div`
  display: flex;
  justify-content: center;
  min-width: 800px;
  min-height: 130px;
  border: thin solid;
  border-color: white;
  border-radius: 15px;
  padding: 25px;
`;

const ContentContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  padding: 10px 0px;
`;

const Text = styled.div<{ size?: number; fontWeight?: string }>`
  color: #d9d9d9;
  font-size: ${(p) => p.size || 16}px;
  font-weight: ${(p) => p.fontWeight || 500};
`;

type Props = {
  title: string;
  account: string | undefined | null;
  actionItems?: JSX.Element;
};

const AccountCard: FC<Props> = ({ title, account, actionItems }) => {
  return (
    <Container>
      <ContentContainer>
        <Text size={30} fontWeight="bold">
          {title}
        </Text>
        <Text>{account ?? ''}</Text>
        {account && <Balance account={account} />}
      </ContentContainer>
      {!!actionItems && actionItems}
    </Container>
  );
};

export default AccountCard;
