// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { VFC } from 'react';
import { Field, FieldValidator, FormikErrors, FormikValues } from 'formik';
import styled from 'styled-components';
import { Label, Text } from './primary';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
`;

const FormField = styled(Field)`
  border-radius: 5px;
  border: thin solid lightgray;
  padding: 5px 10px;
  margin-top: 5px;
  font-size: 16px;
`;

type Props = {
  title: string;
  fieldKey: string;
  validate?: FieldValidator;
  errors?: FormikErrors<FormikValues>;
};

const FormItem: VFC<Props> = ({ title, fieldKey, validate, errors }) => (
  <Container>
    <Label htmlFor={fieldKey}>{title}</Label>
    <FormField name={fieldKey} validate={validate} />
    {!!errors?.[fieldKey] && (
      <Text mt={5} color="red" size={15}>
        {errors[fieldKey]}
      </Text>
    )}
  </Container>
);

export default FormItem;
