// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { FC } from 'react';
import { Formik, FormikHelpers } from 'formik';

import { FieldItem } from 'components/formItem';
import { ButtonContainer, FormContainer, SButton } from 'components/primary';
import {
  initialRegisterValues,
  RegisterFormKey,
  RegisterFormSchema,
  TRegisterValues,
} from 'types/schemas';

import { Title } from '../login/styles';
import prompts from './prompts';
import { ContentContainer, TextContainer } from './styles';
import { RegisterStep } from './types';

type Props = {
  loading: boolean;
  onSubmit: (values: TRegisterValues, helper: FormikHelpers<TRegisterValues>) => void;
};

// FIXME: fix the forms
const IndexerRegistryView: FC<Props> = ({ onSubmit, loading }) => {
  const { title, buttonTitle } = prompts[RegisterStep.register];
  return (
    <ContentContainer>
      <TextContainer>
        <Title size={35} align="center" weight="500">
          {title}
        </Title>
      </TextContainer>
      <Formik
        initialValues={initialRegisterValues}
        validationSchema={RegisterFormSchema}
        onSubmit={onSubmit}
      >
        {({ errors, submitForm }) => (
          <FormContainer>
            <FieldItem title="Indexer Name" fieldKey={RegisterFormKey.name} errors={errors} />
            <FieldItem
              title="Proxy Endpoint"
              fieldKey={RegisterFormKey.proxyEndpoint}
              errors={errors}
            />
            <FieldItem title="Staking Amount" fieldKey={RegisterFormKey.amount} errors={errors} />
            <ButtonContainer alignCenter>
              <SButton
                mt={20}
                width={300}
                title={buttonTitle}
                loading={loading}
                onClick={submitForm}
              />
            </ButtonContainer>
          </FormContainer>
        )}
      </Formik>
    </ContentContainer>
  );
};

export default IndexerRegistryView;
