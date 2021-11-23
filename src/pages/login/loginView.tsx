// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Input } from 'antd';
import { FC } from 'react';
import prompts from './prompts';
import {
  Panel,
  StyledButton,
  ButtonContainer,
  ContentContainer,
  SubTitle,
  Title,
  FormItem,
  LoginForm,
} from './styles';

type Props = {
  onConnected: () => void;
};

const LoginView: FC<Props> = ({ onConnected }) => {
  const { login } = prompts;
  const onConnect = (values: any) => {
    console.log('>>>onFinish:', values);
    // TODO: 1. validate service endpoint
    // TODO: 2. request network type and display network type
    // TODO: 3. go to connect with metamask page
    onConnected();
  };

  return (
    <Panel>
      <ContentContainer>
        <Title>{login.title}</Title>
        <SubTitle>{login.desc}</SubTitle>
        <LoginForm name="login" layout="vertical" onFinish={onConnect}>
          <FormItem name="url" validateStatus="success" label="Coordinator Service Endpoint">
            <Input placeholder="https://you.coordinator.service" />
          </FormItem>
          <FormItem hidden={false} label="Network Type">
            <Input disabled value="Local Network" />
          </FormItem>
          <FormItem>
            <ButtonContainer>
              <StyledButton width="70%" type="primary" htmlType="submit" shape="round" size="large">
                {login.buttonTitle}
              </StyledButton>
            </ButtonContainer>
          </FormItem>
        </LoginForm>
      </ContentContainer>
    </Panel>
  );
};

export default LoginView;
