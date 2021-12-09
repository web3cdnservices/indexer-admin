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
import { ButtonContainer, FormContainer, SButton } from '../../components/primary';
import prompts from './prompts';
import { Panel, ContentContainer, SubTitle, Title } from './styles';
import FormItem from '../../components/formItem';
import {
  initialLoginValues,
  LoginFormKey,
  loginFormSchema,
  TLoginValues,
} from '../../types/schemas';
import { validateCoordinatorService } from '../../utils/validateService';

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
    const uri = `${values.endpoint}/graphql`;
    const { indexer, network } = await validateCoordinatorService(uri, helper);

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
          {({ status, errors, submitForm }) => (
            <FormContainer mt={25}>
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
            </FormContainer>
          )}
        </Formik>
      </ContentContainer>
    </Panel>
  );
};

export default LoginView;
