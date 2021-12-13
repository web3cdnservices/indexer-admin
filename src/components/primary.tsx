// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { FC, useMemo } from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import { Button as SubButton } from '@subql/react-ui';
import { Spin } from 'antd';
import { Form } from 'formik';
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

// new buttons
type StyledButtonProps = {
  align?: string;
  width?: number;
  mt?: number;
};

export const StyledButton = styled(SubButton)<StyledButtonProps>`
  align-self: ${({ align }) => align ?? 'center'}px;
  min-width: ${({ width }) => width ?? 150}px;
  padding: 16px 30px;
  margin-top: ${({ mt }) => mt ?? 0}px;
  font-weight: 500;
`;

type ButtonProps = {
  title: string;
  loading?: boolean;
  disabled?: boolean;
  leftItem?: React.ReactNode;
  type?: 'primary' | 'secondary';
  onClick?: () => void;
};

type SpinProps = {
  loading: boolean;
};

const AntIcon: FC<SpinProps> = ({ loading }) => (
  <LoadingOutlined style={{ fontSize: 20, marginRight: 30, color: '#4388dd' }} spin={loading} />
);

export const Button: FC<ButtonProps & StyledButtonProps> = ({
  title,
  loading,
  disabled,
  type,
  ...props
}) =>
  useMemo(
    () => (
      <StyledButton
        label={title}
        type={type ?? 'secondary'}
        leftItem={loading && <Spin indicator={<AntIcon loading />} />}
        disabled={disabled || loading}
        {...props}
      />
    ),
    [title, loading, disabled]
  );

type Align = 'left' | 'right' | 'centre';

export const ButtonContainer = styled.div<{ mt?: number; align?: Align }>`
  display: flex;
  align-items: center;
  margin-top: ${({ mt }) => mt ?? 0}px;
  width: 100%;
  justify-content: ${({ align }) => {
    if (!align) return 'center';
    switch (align) {
      case 'left':
        return 'flex-start';
      case 'right':
        return 'flex-end';
      default:
        return 'center';
    }
  }};
`;

export const FormContainer = styled(Form)<{ mt?: number }>`
  margin-top: ${({ mt }) => mt ?? 0}px;
  width: 100%;
`;
