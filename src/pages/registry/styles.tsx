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
  margin-top: 50px;
`;

export const ActionButton = styled(Button)`
  width: 250px;
  margin: 20px;
`;

export const ConnectButton = styled(Button)`
  height: 30px;
  width: 150px;
  padding: 20 30;
  border-radius: 15px;
  border-color: white;
  margin-top: 20px;
  color: white;
`;

export const Text = styled.div`
  margin: 0px 20px;
  color: #d9d9d9;
`;
