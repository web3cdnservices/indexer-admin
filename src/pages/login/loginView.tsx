// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { FC } from 'react';
import { useHistory } from 'react-router';
import { HttpLink, useApolloClient } from '@apollo/client';
import { SubqueryNetwork } from '@subql/contract-sdk';
import { Formik, FormikHelpers } from 'formik';

import { FieldItem } from 'components/formItem';
import { Button, ButtonContainer, FormContainer } from 'components/primary';
import { networks } from 'containers/web3';
import { useIsIndexer } from 'hooks/indexerHook';
import { useWeb3 } from 'hooks/web3Hook';
import {
  initialLoginValues,
  LoginFormKey,
  loginFormSchema,
  networkOptions,
  TLoginValues,
} from 'types/schemas';
import { validateCoordinatorService } from 'utils/validateService';

import prompts from './prompts';
import { ContentContainer, Panel, SubTitle, Title } from './styles';

type Props = {
  onConnected: () => void;
};

const LoginView: FC<Props> = ({ onConnected }) => {
  const client = useApolloClient();
  const { account, chainId } = useWeb3();
  const isIndexer = useIsIndexer();
  const history = useHistory();
  const { login } = prompts;

  const isValidNetwork = (network: SubqueryNetwork) => network === networks[chainId ?? 0];

  const handleSubmit = async (values: TLoginValues, helper: FormikHelpers<TLoginValues>) => {
    const { endpoint, networkType } = values;
    const uri = `${endpoint}/graphql`;
    const { indexer, network } = await validateCoordinatorService(uri, networkType, helper);

    client.setLink(new HttpLink({ uri }));
    if (isValidNetwork(network) && isIndexer && indexer === account) {
      history.replace('/account');
    } else if (network) {
      onConnected();
    }
  };

  return (
    <Panel>
      <ContentContainer>
        <Title>{login.title}</Title>
        <SubTitle>{login.desc}</SubTitle>
        <Formik
          initialValues={initialLoginValues}
          validationSchema={loginFormSchema.shape({})}
          onSubmit={handleSubmit}
        >
          {({ status, values, handleChange, errors, submitForm }) => (
            <FormContainer mt={25}>
              <FieldItem
                title={login.endpoint.label}
                placeholder={login.endpoint.palceholder}
                fieldKey={LoginFormKey.endpoint}
                errors={errors}
              />
              <FieldItem
                title={login.network.label}
                fieldKey={LoginFormKey.networkType}
                value={values?.[LoginFormKey.networkType]}
                options={['Select a network', ...networkOptions]}
                onChange={handleChange}
                errors={errors}
              />
              <ButtonContainer mt={60}>
                <Button
                  width={300}
                  type="primary"
                  title={login.buttonTitle}
                  loading={status?.loading}
                  onClick={submitForm}
                />
              </ButtonContainer>
            </FormContainer>
          )}
        </Formik>
      </ContentContainer>
    </Panel>
  );
};

export default LoginView;
