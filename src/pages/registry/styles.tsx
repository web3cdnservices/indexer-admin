// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import styled from '@emotion/styled';
import Button from '@mui/material/Button';

export const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  padding: 50px;
`;

export const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 50px;
`;

export const ActionButton = styled(Button)`
  width: 250px;
  margin: 20px;
`;

export const ConnectButton = styled(Button)`
  height: 40px;
  width: 270px;
  border-radius: 20px;
  border-color: white;
  margin-top: 20px;
  color: white;
`;

export const TextContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  border: thin solid;
  border-color: white;
  height: 60px;
  border-radius: 30px;
  padding: 0px 50px;
  margin: 20px 0px;
`;

export const Text = styled.div<{ size?: number }>`
  color: #d9d9d9;
  font-size: ${(p) => p.size || 16}px;
  margin-right: 20px;
`;
