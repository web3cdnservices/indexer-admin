// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Steps } from 'antd';
import { Formik, Form, FormikValues, FormikHelpers } from 'formik';
import { FC } from 'react';
import styled from 'styled-components';
import { ObjectSchema } from 'yup';
import { FormKey } from '../pages/projects/constant';
import { RegistrySteps } from '../pages/register/styles';
import { getStepStatus } from '../pages/register/utils';
import { FormValues } from '../types/types';
import { ActionType } from '../utils/transactions';
import ActionModal, { ModalProps } from './actionModal';
import FormItem from './formItem';
import { SButton, Text, ButtonContainer } from './primary';

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
export type FormSubmit = (values: FormikValues, helper: FormikHelpers<FormikValues>) => void;

export type FormConfig = {
  formKey: string;
  placeHolder: string;
  formValues: FormikValues;
  schema: ObjectSchema<any>;
  onFormSubmit: FormSubmit;
};

export type StepItem = {
  index: number;
  title: string;
  desc: string;
  buttonTitle: string;
  onClick: ClickAction;
  isForm: boolean;
  formKey?: FormKey;
  placeHolder?: string;
  formValues?: FormikValues;
  form?: FormConfig;
};

export const createStepItem = (
  index: number,
  title: string,
  desc: string,
  buttonTitle: string,
  onClick?: ClickAction,
  form?: FormConfig
) => ({
  index,
  title,
  desc,
  buttonTitle,
  onClick,
  form,
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
  const renderFormContent = (item: StepItem) =>
    item.form ? (
      <Formik
        initialValues={item.form.formValues}
        validationSchema={item.form.schema}
        onSubmit={item.form.onFormSubmit}
      >
        {({ errors, submitForm }) => (
          <Form>
            <FormItem title={item.title} fieldKey={item.formKey ?? ''} errors={errors} />
            {item.desc && (
              <Text mt={20} size={13} color="gray">
                {item.desc}
              </Text>
            )}
            <ButtonContainer>
              <SButton mt={20} title={item.buttonTitle} onClick={submitForm} loading={loading} />
            </ButtonContainer>
          </Form>
        )}
      </Formik>
    ) : null;

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
      <ButtonContainer>
        <SButton title={item.buttonTitle} onClick={() => item.onClick(type)} />
      </ButtonContainer>
    </ContentContainer>
  );

  const renderSteps = () =>
    steps?.length > 1 && (
      <ModalSteps size="small" current={currentStep}>
        {steps.map((item, i) => (
          <RegistrySteps.Step
            key={item.title}
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
