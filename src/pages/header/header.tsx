// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

// @ts-nocheck
import { useHistory } from 'react-router-dom';
import { Hashicon } from '@emeraldpay/hashicon-react';
import { Tabs } from 'antd';
import styled from 'styled-components';

import { Text } from 'components/primary';
import { useController, useIsIndexer } from 'hooks/indexerHook';
import { useIsMetaMask, useWeb3 } from 'hooks/web3Hook';
import SubqueryIcon from 'resources/subquery.svg';

import { Container, LeftContainer, RightContainer } from './styles';

enum TabbarItem {
  account = 'Account',
  projects = 'Projects',
}

const { TabPane } = Tabs;

const TabBars = styled(Tabs)`
  margin-left: 50px;
  margin-top: 20px;
`;

const truncateString = (value: string) =>
  value ? `${value.substring(0, 12)}...${value.substring(value.length - 12)}` : '';

const Header = () => {
  const { account } = useWeb3();
  const history = useHistory();
  const isMetaMask = useIsMetaMask();
  const isIndexer = useIsIndexer();
  const controller = useController(account);

  const onTabBarChange = (key: string) => {
    history.push(key === TabbarItem.account ? '/account' : '/projects');
  };

  return (
    <Container>
      <LeftContainer>
        <img src={SubqueryIcon} alt="subquery" />
        {isIndexer && (
          <TabBars renderTabBar={undefined} onChange={onTabBarChange}>
            <TabPane tab={TabbarItem.account} key={TabbarItem.account} />
            {isIndexer && controller && (
              <TabPane tab={TabbarItem.projects} key={TabbarItem.projects} />
            )}
          </TabBars>
        )}
      </LeftContainer>
      {isMetaMask && (
        <RightContainer>
          <Hashicon hasher="keccak" value={account ?? ''} size={40} />
          <Text size={16} ml={20} mr={20}>
            {truncateString(account ?? '')}
          </Text>
        </RightContainer>
      )}
    </Container>
  );
};

export default Header;
