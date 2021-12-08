// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Form, Formik } from 'formik';
import { FC } from 'react';
import FormItem from '../../../components/formItem';
import { ButtonContainer, SButton } from '../../../components/primary';
import { FormValues } from '../../../types/types';
import { FormKey } from '../constant';

type Props = {
  loading: boolean;
  onClick: (values: FormValues) => void;
};

// TODO: 1. there has 2 types content: [1 - form with button] [description with button]
// TODO: 2. Add step and chain the actions
const ModalContent: FC<Props> = ({ loading, onClick }) => {
  return (
    <Formik
      initialValues={{
        name: '',
        description: '',
      }}
      onSubmit={() => console.log('....')}
    >
      {({ errors, touched, setFieldValue, values, isSubmitting, submitForm }) => (
        <Form>
          <FormItem title="Project Deployment ID" fieldKey={FormKey.NETWORK_TYPE} />
          <ButtonContainer mt={60}>
            <SButton width={250} title="Add Project" />
          </ButtonContainer>
        </Form>
      )}
    </Formik>
  );
};

export default ModalContent;
