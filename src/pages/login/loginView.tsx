// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useLazyQuery } from '@apollo/client';
import { Input } from 'antd';
import { FC, useEffect } from 'react';
import { useHistory } from 'react-router';
import { useIsIndexer } from '../../hooks/indexerHook';
import { useWeb3 } from '../../hooks/web3Hook';
import { GET_ACCOUNT_METADATA } from '../../utils/queries';
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
  const { account } = useWeb3();
  const isIndexer = useIsIndexer();
  const history = useHistory();
  const [getMetadata, { data, loading, error }] = useLazyQuery(GET_ACCOUNT_METADATA);
  const { login } = prompts;

  const onConnect = (values: any) => {
    console.log('>>>onFinish:', values);
    // TODO: update appolo url
    getMetadata();
  };

  useEffect(() => {
    console.log('>>data:', loading, data, error);
    if (!loading && isIndexer && data && !error) {
      if (isIndexer && data.accountMetadata.indexer === account) {
        history.push('/account');
      } else {
        onConnected();
      }
    }
  }, [loading]);

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
              <StyledButton
                loading={loading}
                width="70%"
                type="primary"
                htmlType="submit"
                shape="round"
                size="large"
              >
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
