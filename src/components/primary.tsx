// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Color } from '@mui/material';
import { Button as AntButton } from 'antd';
import { FC } from 'react';
import styled from 'styled-components';

export const Separator = styled.div<{ height?: number }>`
  min-height: 20px;
  height: ${(p) => p.height || 20}px;
`;

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

const StyledButton = styled(AntButton)<{
  width?: number;
  align?: string;
  margin?: number;
  color?: string;
}>`
  background-color: ${({ color }) => color ?? '#4388dd'};
  align-self: ${({ align }) => align ?? 'center'}px;
  width: ${({ width }) => width ?? 150}px;
  margin: ${({ margin }) => margin ?? 0}px;
`;

type ButtonProps = {
  title: string;
  onClick: () => void;
  loading?: boolean;
  color?: string;
  width?: number;
  margin?: number;
};

export const Button: FC<ButtonProps> = ({ title, onClick, loading, color, width, margin }) => (
  <StyledButton
    loading={!!loading}
    align="center"
    width={width}
    type="primary"
    shape="round"
    size="large"
    color={color}
    margin={margin}
    onClick={onClick}
  >
    {title}
  </StyledButton>
);
