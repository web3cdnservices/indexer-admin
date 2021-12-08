// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { SubqueryNetwork } from '@subql/contract-sdk';
import { Input } from 'antd';
import { FC, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { useApolloClient, HttpLink } from '@apollo/client';
import { networks } from '../../containers/web3';
import { useIsIndexer } from '../../hooks/indexerHook';
import { useWeb3 } from '../../hooks/web3Hook';
import { GET_ACCOUNT_METADATA, QueryResult } from '../../utils/queries';
import Config from '../../utils/config';
import prompts from './prompts';
import {
  Panel,
  ButtonContainer,
  ContentContainer,
  SubTitle,
  Title,
  FormItem,
  LoginForm,
} from './styles';
import { FormKey } from '../projects/constant';
import { createApolloClient, saveClientUri } from '../../utils/apolloClient';
import { SButton } from '../../components/primary';

type Props = {
  onConnected: () => void;
};

// TODO: refactor
const LoginView: FC<Props> = ({ onConnected }) => {
  const [{ loading, data, error }, setQueryResult] = useState<QueryResult>({});

  const client = useApolloClient();
  const { account, chainId } = useWeb3();
  const isIndexer = useIsIndexer();
  const history = useHistory();
  const { login } = prompts;

  const isValidNetwork = (network: SubqueryNetwork) => network === networks[chainId ?? 0];

  useEffect(() => {
    if (!loading && !error && data && data.accountMetadata) {
      const { indexer, network, wsEndpoint } = data.accountMetadata;
      Config.getInstance().config({ network, wsEndpoint });

      if (isValidNetwork(network) && isIndexer && indexer === account) {
        history.replace('/account');
      } else {
        onConnected();
      }
    }
  }, [loading, data, error]);

  const onConnect = () => {
    // FIXME: ffff
    const values = { [FormKey.LOGIN]: 'http://localhost:8000' };
    const serviceUrl = values[FormKey.LOGIN] as string;
    // FIXME: regx for url
    // const re = /^(https?):\/\/[^s$.?#].[^s]*$'/gm;
    if (serviceUrl) {
      const uri = `${serviceUrl}/graphql`;
      setQueryResult({ loading: true });
      createApolloClient(uri)
        .query({ query: GET_ACCOUNT_METADATA })
        .then(({ data }) => {
          // FIXME: just delay the request for testing
          setTimeout(() => {
            client.setLink(new HttpLink({ uri }));
            saveClientUri(uri);
            setQueryResult({ error: undefined, loading: false, data });
          }, 2000);
        })
        .catch((error) => {
          setQueryResult({ loading: false, error });
        });
    } else {
      console.error('Invalid service url:', serviceUrl);
    }
  };

  return (
    <Panel>
      <ContentContainer>
        <Title>{login.title}</Title>
        <SubTitle>{login.desc}</SubTitle>
        <LoginForm name="login" layout="vertical" onFinish={onConnect}>
          <FormItem name={FormKey.LOGIN} validateStatus="success" label={login.endpointform.label}>
            <Input placeholder={login.endpointform.palceholder} />
          </FormItem>
          <FormItem hidden={false} label={login.networkFormLabel}>
            <Input disabled value="" />
          </FormItem>
          <FormItem>
            <ButtonContainer>
              <SButton width={350} title={login.buttonTitle} onClick={onConnect} />
            </ButtonContainer>
          </FormItem>
        </LoginForm>
      </ContentContainer>
    </Panel>
  );
};

export default LoginView;
