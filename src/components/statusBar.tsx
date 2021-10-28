// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import styled from '@emotion/styled';
import { chainNames } from '../containers/web3';
import { useIsMetaMask, useWeb3 } from '../hooks/web3Hook';

const Container = styled.div`
  position: absolute;
  direction: row;
  top: 10px;
  right: 0px;
  width: 50%;
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

const StatusBar = () => {
  const { active, chainId } = useWeb3();
  const isMetaMask = useIsMetaMask();

  const provider = active ? 'Actived' : 'Inactived';
  const status = isMetaMask ? 'Connected' : 'DisConnected';
  const chainName = chainId ? chainNames[chainId] : '';

  return (
    <Container>
      <ContentContainer>
        <Text>{chainName}</Text>
        {!!chainName && <StatusCard>Chain</StatusCard>}
        <Text>{provider}</Text>
        <StatusCard>Provider</StatusCard>
        <Text>{status}</Text>
        <StatusCard>Status</StatusCard>
      </ContentContainer>
    </Container>
  );
};

export default StatusBar;
