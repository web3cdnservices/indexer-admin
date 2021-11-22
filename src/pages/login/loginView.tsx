// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Input } from 'antd';
import { FC } from 'react';
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

const title = 'Welcome to Indexer Admin';
const subTitle = "Let's connect with coordinator service to use the indexer admin";
const button = 'Connect';

type Props = {
  onConnected: () => void;
};

const LoginView: FC<Props> = ({ onConnected }) => {
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
        <Title>{title}</Title>
        <SubTitle>{subTitle}</SubTitle>
        <LoginForm name="login" layout="vertical" onFinish={onConnect}>
          <FormItem name="url" validateStatus="success" label="Coordinator Service Endpoint">
            <Input placeholder="https://you.coordinator.service" />
          </FormItem>
          <FormItem hidden={false} label="Network Type">
            <Input disabled value="Local Network" />
          </FormItem>
          <FormItem>
            <ButtonContainer>
              <StyledButton type="primary" htmlType="submit" shape="round" size="large">
                {button}
              </StyledButton>
            </ButtonContainer>
          </FormItem>
        </LoginForm>
      </ContentContainer>
    </Panel>
  );
};

export default LoginView;
