// Copyright 2020-2022 SubQuery Pte Ltd authors & contributors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex: 1;
  justify-content: center;
`;

export const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  min-width: 600px;
  padding: 10px 100px;
  padding-bottom: 150px;
  overflow-y: scroll;
`;

export const HeaderContainer = styled.div`
  display: flex;
  width: 100%;
  min-width: 600px;
  align-items: center;
  justify-content: space-between;
`;

export const ItemContainer = styled.div<{
  flex?: number;
  pl?: number;
  mw?: number;
  color?: string;
}>`
  display: flex;
  flex: ${({ flex }) => flex ?? 1};
  background-color: ${({ color }) => color ?? 'white'};
  padding-left: ${({ pl }) => pl ?? 0}px;
  min-width: ${({ mw }) => mw ?? 100}px;
  margin-right: 15px;
  align-items: center;
`;
