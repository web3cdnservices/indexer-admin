// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Button } from 'antd';
import styled from 'styled-components';

export const Text = styled.div<{ size?: number; fw?: string; mr?: number; mt?: number }>`
  // TODO: support diff font-family props
  color: black;
  font-size: ${({ size }) => size ?? 18}px;
  font-weight: ${({ fw }) => fw ?? 400};
  margin-right: ${({ mr }) => mr ?? 0}px;
  margin-top: ${({ mt }) => mt ?? 0}px;
`;

export const StyledButton = styled(Button)<{ width?: string }>`
  background-color: #4388dd;
  align-self: center;
  width: ${({ width }) => width || '30%'};
`;
