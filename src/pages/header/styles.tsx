// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  width: 100vw;
  align-items: center;
  justify-content: space-between;
  min-height: 80px;
  padding: 0px 40px;
  border-bottom: 1px solid lightgray;
`;

export const LeftContainer = styled.div`
  display: flex;
  align-items: center;
`;

export const RightContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0px 20px;
  background-color: rgba(67, 136, 221, 0.24);
  border-radius: 10px;
  min-width: 260px;
  height: 55px;
`;
