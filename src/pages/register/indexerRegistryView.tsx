// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { FC } from 'react';
import { Input } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import { Title, StyledButton } from '../login/styles';
import { ContentContainer, FormContainer, TextContainer } from './styles';
import prompts from './prompts';
import { RegisterStep } from './types';
import { FormValues } from '../../types/types';

type Props = {
  loading: boolean;
  onClick: (values: FormValues) => void;
};

export enum RegisterFormKey {
  name = 'register-indexer-name',
  endpoint = 'register-proxy-endpoint',
  amount = 'register-staking-amount',
}

const IndexerRegistryView: FC<Props> = ({ onClick, loading }) => {
  const { title, buttonTitle } = prompts[RegisterStep.register];
  return (
    <ContentContainer>
      <TextContainer>
        <Title size={35} align="center" weight="500">
          {title}
        </Title>
      </TextContainer>
      <FormContainer layout="vertical" onFinish={(values) => onClick(values as FormValues)}>
        <FormItem name={RegisterFormKey.name} label="Name">
          <Input size="large" placeholder="Indexer Name" />
        </FormItem>
        <FormItem name={RegisterFormKey.endpoint} label="Proxy Endpoint">
          <Input size="large" placeholder="http://localhost:8003" />
        </FormItem>
        <FormItem name={RegisterFormKey.amount} label="Staking Amount">
          <Input size="large" placeholder="1000" />
        </FormItem>
        <StyledButton
          loading={loading}
          width="30%"
          type="primary"
          shape="round"
          size="large"
          htmlType="submit"
        >
          {buttonTitle}
        </StyledButton>
      </FormContainer>
    </ContentContainer>
  );
};

export default IndexerRegistryView;
