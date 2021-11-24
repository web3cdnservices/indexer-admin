// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Button as AntButton } from 'antd';
import styled from 'styled-components';

export const Text = styled.div<{
  size?: number;
  fw?: string;
  mr?: number;
  mt?: number;
  mb?: number;
  clolor?: string;
}>`
  // TODO: support diff font-family props
  color: ${({ color }) => color ?? 'black'};
  font-size: ${({ size }) => size ?? 18}px;
  font-weight: ${({ fw }) => fw ?? 400};
  margin-right: ${({ mr }) => mr ?? 0}px;
  margin-top: ${({ mt }) => mt ?? 0}px;
  margin-bottom: ${({ mb }) => mb ?? 0}px;
`;

export const Button = styled(AntButton)<{ width?: number; align?: string }>`
  background-color: #4388dd;
  align-self: ${({ align }) => align ?? 'center'}px;
  width: ${({ width }) => width ?? 150}px;
`;
