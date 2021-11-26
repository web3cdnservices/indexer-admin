// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Form, Input } from 'antd';
import { FC } from 'react';
import styled from 'styled-components';
import { Button } from '../../../components/primary';
import { ButtonContainer, FormItem } from '../../login/styles';
import { FormKey } from '../constant';
import { FormValues } from '../types';

export const LoginForm = styled(Form)`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
  padding: 20px;
`;

type Props = {
  loading: boolean;
  onClick: (values: FormValues) => void;
};

// TODO: 1. there has 2 types content: [1 - form with button] [description with button]
// TODO: 2. Add step and chain the actions
const ModalContent: FC<Props> = ({ loading, onClick }) => {
  return (
    <LoginForm name="login" layout="vertical" onFinish={(values) => onClick(values as FormValues)}>
      <FormItem name={FormKey.ADD_PROJECT} validateStatus="success" label="Project Deployment ID">
        <Input size="large" placeholder="0xd6baee14e74baf30a5e409573d801575397f358ea91be5ce64" />
      </FormItem>
      <FormItem>
        <ButtonContainer>
          <Button width={250} title="Add Project" loading={loading} htmlType="submit" />
        </ButtonContainer>
      </FormItem>
    </LoginForm>
  );
};

export default ModalContent;
