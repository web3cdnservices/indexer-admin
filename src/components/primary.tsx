// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Button as AntButton } from 'antd';
import { FC } from 'react';
import styled from 'styled-components';

export const Text = styled.div<{
  size?: number;
  fw?: string;
  ml?: number;
  mr?: number;
  mt?: number;
  mb?: number;
  mw?: number;
  clolor?: string;
}>`
  // TODO: support diff font-family props
  color: ${({ color }) => color ?? 'black'};
  font-size: ${({ size }) => size ?? 18}px;
  font-weight: ${({ fw }) => fw ?? 400};
  margin-left: ${({ ml }) => ml ?? 0}px;
  margin-right: ${({ mr }) => mr ?? 0}px;
  margin-top: ${({ mt }) => mt ?? 0}px;
  margin-bottom: ${({ mb }) => mb ?? 0}px;
  min-width: ${({ mw }) => mw ?? 10}px;
  overflow-wrap: break-word;
`;

const StyledButton = styled(AntButton)<{ width?: number; align?: string }>`
  background-color: #4388dd;
  align-self: ${({ align }) => align ?? 'center'}px;
  width: ${({ width }) => width ?? 150}px;
`;

type ButtonProps = {
  title: string;
  onClick: () => void;
  loading?: boolean;
  width?: number;
};

export const Button: FC<ButtonProps> = ({ title, loading, width, onClick }) => (
  <StyledButton
    loading={!!loading}
    align="center"
    width={width}
    type="primary"
    shape="round"
    size="large"
    onClick={onClick}
  >
    {title}
  </StyledButton>
);
