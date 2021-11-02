// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import styled from '@emotion/styled';
import { chainNames } from '../containers/web3';
import { useAccountType, useIsController, useIsIndexer } from '../hooks/indexerHook';
import { useIsMetaMask, useWeb3 } from '../hooks/web3Hook';

const Container = styled.div`
  position: absolute;
  direction: row;
  top: 10px;
  right: 0px;
  width: 100%;
  height: 35px;
  min-width: 300px;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
`;

const StatusCard = styled.div`
  margin-right: 10px;
  padding: 10px;
  background-color: #2b8c8a;
  border-radius: 5px;
  border-width: 1px;
  color: white;
`;

const Text = styled.div`
  margin-right: 20px;
  color: #d9d9d9;
`;

const barNames = {
  accountType: 'Account Type',
  status: 'Status',
  network: 'Network',
};

const StatusBar = () => {
  const { chainId, account } = useWeb3();
  const isMetaMask = useIsMetaMask();
  const accountType = useAccountType(account);

  const status = isMetaMask ? 'Connected' : 'Disconnected';
  const chainName = chainId ? chainNames[chainId] : '';

  return (
    <Container>
      <ContentContainer>
        <Text>{chainName}</Text>
        {!!chainName && <StatusCard>{barNames.network}</StatusCard>}
        <Text>{status}</Text>
        <StatusCard>{barNames.status}</StatusCard>
        <Text>{accountType}</Text>
        {!!accountType && <StatusCard>{barNames.accountType}</StatusCard>}
      </ContentContainer>
    </Container>
  );
};

export default StatusBar;
