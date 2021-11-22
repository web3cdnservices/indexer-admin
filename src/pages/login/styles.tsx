// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';
import { Button, Form } from 'antd';

export const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
`;

export const Panel = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  background-color: white;
  width: 610px;
  height: 604px;
  border-radius: 18px;
  padding: 70px;
  padding-top: 105px;
  margin-top: -50px;
`;

export const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Title = styled.div<{ size?: number; align?: string; weight?: string }>`
  text-align: ${(p) => p.align || 'left'};
  font-weight: ${(p) => p.weight || 'bold'};
  font-size: ${(p) => p.size || 28}px;
`;

export const SubTitle = styled.div`
  font-size: 16px;
  margin-top: 15px;
`;

export const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 30px;
`;

export const StyledButton = styled(Button)`
  align-self: center;
  margin-top: 50px;
  width: 70%;
`;

export const LoginForm = styled(Form)`
  margin-top: 25px;
`;

export const FormItem = styled(Form.Item)`
  font-size: 16px;
  font-weight: bold;
`;

export const ImageCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  border: thin solid;
  border-color: lightgray;
  border-radius: 16px;
`;

export const Image = styled.img`
  width: 120px;
  height: 120px;
`;
