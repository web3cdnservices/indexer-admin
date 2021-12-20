// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable */
import * as React from 'react';
import { Redirect } from 'react-router';
import { useIsIndexer } from 'hooks/indexerHook';
import { useWeb3 } from 'hooks/web3Hook';
import MetaMaskView from '../metamask/metamaskView';
import { Container } from './styles';
import { useCoordinatorIndexer } from 'containers/coordinatorIndexer';

const LoginPage = () => {
  const { account } = useWeb3();
  const isIndexer = useIsIndexer();

  const { indexer: coordinatorIndexer, loading, load } = useCoordinatorIndexer();

  React.useEffect(() => {
    load();
  }, [load]);

  if (loading) {
    // TODO loading UI
    return null;
  }

  return (
    <Container>
      {!account ? (
        <MetaMaskView />
      ) : (
        <Redirect to={isIndexer && coordinatorIndexer ? '/account' : '/register'} />
      )}
    </Container>
  );
};

export default LoginPage;
