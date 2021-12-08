// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { FC } from 'react';
import { Formik, Form } from 'formik';
import { Title } from '../login/styles';
import { ContentContainer, TextContainer } from './styles';
import prompts from './prompts';
import { RegisterStep } from './types';
import { FormValues } from '../../types/types';
import FormItem from '../../components/formItem';
import { ButtonContainer, SButton } from '../../components/primary';

type Props = {
  loading: boolean;
  onClick: (values: FormValues) => void;
};

export enum RegisterFormKey {
  name = 'register-indexer-name',
  endpoint = 'register-proxy-endpoint',
  amount = 'register-staking-amount',
}

// FIXME: fix the forms
const IndexerRegistryView: FC<Props> = ({ onClick, loading }) => {
  const { title, buttonTitle } = prompts[RegisterStep.register];
  return (
    <ContentContainer>
      <TextContainer>
        <Title size={35} align="center" weight="500">
          {title}
        </Title>
      </TextContainer>
      <Formik
        initialValues={{
          name: '',
          description: '',
        }}
        onSubmit={() => console.log('....')}
      >
        {({ errors, touched, setFieldValue, values, isSubmitting, submitForm }) => (
          <Form>
            <FormItem title="Indexer Name" fieldKey={RegisterFormKey.name} />
            <FormItem title="Proxy Endpoint" fieldKey={RegisterFormKey.endpoint} />
            <FormItem title="Staking Amount" fieldKey={RegisterFormKey.amount} />
            <ButtonContainer>
              <SButton mt={20} title={buttonTitle} />
            </ButtonContainer>
          </Form>
        )}
      </Formik>
    </ContentContainer>
  );
};

export default IndexerRegistryView;
