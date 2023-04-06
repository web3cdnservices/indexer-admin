// Copyright 2020-2022 SubQuery Pte Ltd authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Dispatch, SetStateAction } from 'react';
import { FormikValues } from 'formik';
import { ObjectSchema } from 'yup';

import { ClickAction, FormSubmit, ModalAction } from 'pages/project-details/types';

export type TFieldItem = {
  title: string;
  formKey: string;
  value?: string | number;
  placeholder?: string;
  options?: string[];
};

export type FormConfig = {
  placeHolder?: string;
  formValues: FormikValues;
  schema: ObjectSchema<any>;
  onFormSubmit: FormSubmit;
  items: TFieldItem[];
};

export type StepItem = {
  index: number;
  title: string;
  desc: string;
  popupType?: 'modal' | 'drawer';
  buttonTitle: string;
  onClick?: ClickAction;
  form?: FormConfig;
};

export type TModal = {
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
  steps: StepItem[];
  title?: string;
  currentStep?: number;
  loading?: boolean;
  type?: ModalAction;
  onClose?: () => void;
};
