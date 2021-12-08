// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { SubqueryNetwork } from '@subql/contract-sdk';
import { Formik, FormikHelpers } from 'formik';
import { FC } from 'react';
import { useHistory } from 'react-router';
import { useApolloClient, HttpLink } from '@apollo/client';
import { networks } from '../../containers/web3';
import { useIsIndexer } from '../../hooks/indexerHook';
import { useWeb3 } from '../../hooks/web3Hook';
import { GET_ACCOUNT_METADATA } from '../../utils/queries';
import { ButtonContainer, SButton } from '../../components/primary';
import Config from '../../utils/config';
import prompts from './prompts';
import { Panel, ContentContainer, SubTitle, Title, LoginForm } from './styles';
import { createApolloClient, saveClientUri } from '../../utils/apolloClient';
import FormItem from '../../components/formItem';
import {
  initialLoginValues,
  LoginFormKey,
  loginFormSchema,
  TLoginValues,
} from '../../types/schemas';

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

  const onConnect = (data: any) => {
    if (data && data.accountMetadata) {
      const { indexer, network, wsEndpoint } = data.accountMetadata;
      Config.getInstance().config({ network, wsEndpoint });

      if (isValidNetwork(network) && isIndexer && indexer === account) {
        history.replace('/account');
      } else {
        onConnected();
      }
    }
  };

  const handleSubmit = (values: TLoginValues, helper: FormikHelpers<TLoginValues>) => {
    const { endpoint } = values;
    const uri = `${endpoint}/graphql`;
    helper.setStatus({ loading: true });

    createApolloClient(uri)
      .query({ query: GET_ACCOUNT_METADATA })
      .then(({ data }) => {
        client.setLink(new HttpLink({ uri }));
        saveClientUri(uri);
        setTimeout(() => {
          onConnect(data);
          helper.setStatus({ loading: false });
        }, 2000);
      })
      .catch(() => {
        helper.setErrors({ [LoginFormKey.endpoint]: 'Invalid service endpoint' });
        helper.setStatus({ loading: false });
      });
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
          {({ status, errors, submitForm }) => (
            <LoginForm>
              <FormItem
                title={login.endpointform.label}
                fieldKey={LoginFormKey.endpoint}
                errors={errors}
              />
              <FormItem
                title={login.networkFormLabel}
                fieldKey={LoginFormKey.networkType}
                errors={errors}
              />
              <ButtonContainer alignCenter mt={60}>
                <SButton
                  width={300}
                  title={login.buttonTitle}
                  loading={status?.loading}
                  onClick={submitForm}
                />
              </ButtonContainer>
            </LoginForm>
          )}
        </Formik>
      </ContentContainer>
    </Panel>
  );
};

export default LoginView;
