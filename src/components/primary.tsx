// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Button as AntButton, Spin } from 'antd';
import { Button as SubButton } from '@subql/react-ui';
import { LoadingOutlined } from '@ant-design/icons';
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
  // font-family: ${({ ff }) => ff ?? 'Futura'};
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
  min-width: ${({ width }) => width ?? 150}px;
  padding: 16px 30px;
  margin-top: ${({ mt }) => mt ?? 0}px;
  font-weight: 500;
`;

type SButtonProps = {
  title: string;
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
};

type SpinProps = {
  loading: boolean;
};

const AntIcon: FC<SpinProps> = ({ loading }) => (
  <LoadingOutlined style={{ fontSize: 20, marginRight: 30, color: '#4388dd' }} spin={loading} />
);

export const SButton: FC<SButtonProps & SSButtonProps> = ({
  title,
  loading,
  disabled,
  ...props
}) => (
  <StyledSButton
    label={title}
    type="secondary"
    leftItem={loading && <Spin indicator={<AntIcon loading />} />}
    disabled={disabled}
    {...props}
  />
);

export const ButtonContainer = styled.div<{ mt?: number; alignCenter?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: ${({ alignCenter }) => (alignCenter ? 'center' : 'flex-end')};
  margin-top: ${({ mt }) => mt ?? 0}px;
  width: 100%;
`;
