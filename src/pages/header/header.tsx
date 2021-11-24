// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Tabs } from 'antd';
import { Hashicon } from '@emeraldpay/hashicon-react';
import { Container, LeftContainer, RightContainer } from './styles';
import SubqueryIcon from '../../resources/subquery.svg';
import { Text } from '../../components/primary';
import { useIsMetaMask, useWeb3 } from '../../hooks/web3Hook';
import { useController, useIsIndexer } from '../../hooks/indexerHook';

const { TabPane } = Tabs;

// FIXME: fix tabs
const Header = () => {
  const { account } = useWeb3();
  const isMetaMask = useIsMetaMask();
  const isIndexer = useIsIndexer();
  const controller = useController(account);

  // FIXME: rerender when router changed or contract state changed

  return (
    <Container>
      <LeftContainer>
        <img src={SubqueryIcon} alt="subquery" />
        {isIndexer && (
          <Tabs renderTabBar={undefined} style={{ marginLeft: 50, marginTop: 20 }}>
            <TabPane tab="Account" key="1" />
            {isIndexer && controller && <TabPane tab="Project" key="2" />}
          </Tabs>
        )}
      </LeftContainer>
      {isMetaMask && (
        <RightContainer>
          <Hashicon hasher="keccak" value={account ?? ''} size={40} />
          <Text size={16} mr={40}>
            Subquery Master
          </Text>
        </RightContainer>
      )}
    </Container>
  );
};

export default Header;
