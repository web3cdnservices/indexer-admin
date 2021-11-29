// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Form, Input, message, Steps } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import { FC } from 'react';
import styled from 'styled-components';
import { ButtonContainer } from '../pages/login/styles';
import { FormKey } from '../pages/projects/constant';
import { FormValues } from '../pages/projects/types';
import { RegistrySteps } from '../pages/register/styles';
import { getStepStatus } from '../pages/register/utils';
import { ActionType } from '../utils/transactions';
import ActionModal, { ModalProps } from './actionModal';
import { Button, Text } from './primary';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  padding-top: 10px;
  padding-bottom: 25px;
`;

export const ModalSteps = styled(Steps)`
  width: 100%;
  min-width: 350px;
  margin-bottom: 40px;
`;

export const InputForm = styled(Form)`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
`;

export const ContentContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
`;

export const DescContainer = styled.div`
  display: flex;
  width: 80%;
  flex-direction: column;
  align-items: center;
`;

export type ClickAction = (type?: ActionType, values?: FormValues) => void;

export type StepItem = {
  index: number;
  title: string;
  desc: string;
  buttonTitle: string;
  onClick: ClickAction;
  isForm: boolean;
  formKey?: FormKey;
  placeHolder?: string;
};

export const createStepItem = (
  index: number,
  title: string,
  desc: string,
  buttonTitle: string,
  onClick: ClickAction,
  isForm: boolean,
  formKey?: FormKey,
  placeHolder?: string
) => ({
  index,
  title,
  desc,
  buttonTitle,
  onClick,
  isForm,
  formKey,
  placeHolder,
});

type Props = {
  steps: StepItem[] | undefined;
  currentStep: number;
  loading: boolean;
  type?: ActionType;
} & ModalProps;

const ModalView: FC<Props> = ({
  visible,
  title,
  onClose,
  currentStep = 0,
  steps,
  type,
  loading,
}) => {
  if (!steps || currentStep > steps.length - 1) return null;
  const stepItem = steps[currentStep];

  // FIXME: form validation
  const renderFormContent = (item: StepItem) => (
    <InputForm
      name={title}
      layout="vertical"
      onFinish={(values) => item.onClick(type, values as FormValues)}
    >
      <div>
        <FormItem name={item.formKey} label={item.title}>
          <Input size="large" placeholder={item.placeHolder} />
        </FormItem>
        {item.desc && (
          <Text mt={20} size={13} color="gray">
            {item.desc}
          </Text>
        )}
      </div>
      <FormItem>
        <ButtonContainer>
          <Button width={350} title={item.buttonTitle} loading={loading} htmlType="submit" />
        </ButtonContainer>
      </FormItem>
    </InputForm>
  );

  const renderContent = (item: StepItem) => (
    <ContentContainer>
      <DescContainer>
        <Text fw="600" mt={20}>
          {item.title}
        </Text>
        <Text mt={20} size={15} color="gray">
          {item.desc}
        </Text>
      </DescContainer>
      <Button
        width={350}
        title={item.buttonTitle}
        loading={loading}
        onClick={() => item.onClick(type)}
      />
    </ContentContainer>
  );

  const renderSteps = () =>
    steps?.length > 1 && (
      <ModalSteps size="small" current={currentStep}>
        {steps.map((item, i) => (
          <RegistrySteps.Step
            key={item.index}
            status={getStepStatus(currentStep, i)}
            title={item.buttonTitle}
          />
        ))}
      </ModalSteps>
    );

  return (
    <ActionModal title={title} visible={visible} onClose={onClose}>
      <Container>
        {renderSteps()}
        {stepItem.isForm ? renderFormContent(stepItem) : renderContent(stepItem)}
      </Container>
    </ActionModal>
  );
};

export default ModalView;
