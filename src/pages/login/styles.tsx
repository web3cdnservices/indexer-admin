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

export const Title = styled.div`
  font-size: 28px;
  font-weight: bold;
`;

export const SubTitle = styled.div`
  font-size: 16px;
  margin-top: 15px;
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
