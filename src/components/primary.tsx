// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Button as AntButton } from 'antd';
import { Button as SubButton } from '@subql/react-ui';
import { ButtonHTMLType } from 'antd/lib/button/button';
import { FC } from 'react';
import styled from 'styled-components';

export const Separator = styled.div<{
  height?: number;
  width?: number;
  color?: string;
  mr?: number;
}>`
  height: ${({ height }) => height ?? 1}px;
  width: ${({ width }) => width ?? 1}px;
  background-color: ${({ color }) => color ?? 'lightgray'};
  margin-right: ${({ mr }) => mr ?? 0}px;
`;

type TextProps = {
  size?: number;
  fw?: string;
  ml?: number;
  mr?: number;
  mt?: number;
  mb?: number;
  mw?: number;
  clolor?: string;
  ff?: string;
};

export const Text = styled.div<TextProps>`
  color: ${({ color }) => color ?? '#1A202C'};
  font-size: ${({ size }) => size ?? 18}px;
  font-weight: ${({ fw }) => fw ?? 400};
  margin-left: ${({ ml }) => ml ?? 0}px;
  margin-right: ${({ mr }) => mr ?? 0}px;
  margin-top: ${({ mt }) => mt ?? 0}px;
  margin-bottom: ${({ mb }) => mb ?? 0}px;
  min-width: ${({ mw }) => mw ?? 10}px;
  overflow-wrap: break-word;
`;

export const Label = styled.label<TextProps>`
  color: ${({ color }) => color ?? '#1A202C'};
  font-size: ${({ size }) => size ?? 15}px;
  font-weight: ${({ fw }) => fw ?? 500};
  margin-left: ${({ ml }) => ml ?? 0}px;
  margin-right: ${({ mr }) => mr ?? 0}px;
  margin-top: ${({ mt }) => mt ?? 0}px;
  margin-bottom: ${({ mb }) => mb ?? 0}px;
  min-width: ${({ mw }) => mw ?? 10}px;
  font-family: ${({ ff }) => ff ?? 'Futura'};
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
  onClick?: () => void;
  htmlType?: ButtonHTMLType;
  loading?: boolean;
  color?: string;
  width?: number;
  margin?: number;
};

export const Button: FC<ButtonProps> = ({
  title,
  onClick,
  loading,
  htmlType,
  color,
  width,
  margin,
}) => (
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
    htmlType={htmlType ?? 'button'}
  >
    {title}
  </StyledButton>
);

// new buttons
type SSButtonProps = {
  align?: string;
  width?: number;
  mt?: number;
};

export const StyledSButton = styled(SubButton)<SSButtonProps>`
  align-self: ${({ align }) => align ?? 'center'}px;
  width: ${({ width }) => width ?? 150}px;
  margin-top: ${({ mt }) => mt ?? 0}px;
  font-weight: 500;
`;

type SButtonProps = {
  title: string;
  onClick?: () => void;
};

export const SButton: FC<SButtonProps & SSButtonProps> = ({ title, ...props }) => (
  <StyledSButton label={title} type="secondary" {...props} />
);

export const ButtonContainer = styled.div<{ mt?: number }>`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-top: ${({ mt }) => mt ?? 0}px;
`;
