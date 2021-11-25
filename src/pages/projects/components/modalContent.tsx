// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Form, Input } from 'antd';
import styled from 'styled-components';
import { Button } from '../../../components/primary';
import { ButtonContainer, FormItem, StyledButton } from '../../login/styles';

export const LoginForm = styled(Form)`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
  padding: 20px;
`;

// TODO: 1. there has 2 types content: [1 - form with button] [description with button]
// TODO: 2. Add step and chain the actions
const ModalContent = () => {
  const onAddProject = () => console.log('>>>add project');
  return (
    <LoginForm name="login" layout="vertical" onFinish={onAddProject}>
      <FormItem name="url" validateStatus="success" label="Project Deployment ID">
        <Input size="large" placeholder="0xd6baee14e74baf30a5e409573d801575397f358ea91be5ce64" />
      </FormItem>
      <FormItem>
        <ButtonContainer>
          <Button
            width={250}
            title="Add Project"
            loading={false}
            htmlType="submit"
            onClick={() => console.log('>>>')}
          />
        </ButtonContainer>
      </FormItem>
    </LoginForm>
  );
};

export default ModalContent;
