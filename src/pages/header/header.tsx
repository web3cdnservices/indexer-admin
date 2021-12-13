// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

// @ts-nocheck
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

import Avatar from 'components/avatar';
import { Text } from 'components/primary';
import { useController, useIsIndexer } from 'hooks/indexerHook';
import { useIsMetaMask, useWeb3 } from 'hooks/web3Hook';
import SubqueryIcon from 'resources/subquery.svg';

import { Container, LeftContainer, RightContainer } from './styles';

enum TabbarItem {
  account = 'Account',
  projects = 'Projects',
}

const TabBar = styled(NavLink)`
  margin-left: 50px;
  margin-top: 20px;
  color: #1a202c;
  text-decoration: none;
  font-family: Futura;
  font-size: 16px;
  :hover {
    text-decoration: underline;
  }
`;

const truncateString = (value: string) =>
  value ? `${value.substring(0, 12)}...${value.substring(value.length - 12)}` : '';

const Header = () => {
  const { account } = useWeb3();
  const isMetaMask = useIsMetaMask();
  const isIndexer = useIsIndexer();
  const controller = useController(account);
  const activeStyle = { fontWeight: 500, color: '#4388dd' };

  const renderTabbars = () => (
    <div>
      <TabBar to="/account" activeStyle={activeStyle}>
        {TabbarItem.account}
      </TabBar>
      {controller && (
        <TabBar to="/projects" activeStyle={activeStyle}>
          {TabbarItem.projects}
        </TabBar>
      )}
    </div>
  );

  return (
    <Container>
      <LeftContainer>
        <img src={SubqueryIcon} alt="subquery" />
        {isIndexer && renderTabbars()}
      </LeftContainer>
      {isMetaMask && (
        <RightContainer>
          <Avatar address={account ?? ''} size={40} />
          <Text size={16} ml={20} mr={20}>
            {truncateString(account ?? '')}
          </Text>
        </RightContainer>
      )}
    </Container>
  );
};

export default Header;
