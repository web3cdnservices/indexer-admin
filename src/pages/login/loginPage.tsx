// Copyright 2020-2022 SubQuery Pte Ltd authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable */
import { useEffect } from 'react';
import { Redirect } from 'react-router';
import { useIsIndexer } from 'hooks/indexerHook';
import { useWeb3 } from 'hooks/web3Hook';
import { useCoordinatorIndexer } from 'containers/coordinatorIndexer';
import { useLoading } from 'containers/loadingContext';
import { isUndefined } from 'lodash';
import { Container } from './styles';

const LoginPage = () => {
  const { account } = useWeb3();
  const isIndexer = useIsIndexer();
  const { setPageLoading } = useLoading();
  const { indexer: coordinatorIndexer, loading, load } = useCoordinatorIndexer();

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    setPageLoading(loading || isUndefined(isIndexer));
  }, [loading, isIndexer]);

  return (
    <Container>
      <div>
        {account && !isIndexer && !coordinatorIndexer && <Redirect to="/register" />}
        {account && !!coordinatorIndexer && <Redirect to="/account" />}
      </div>
    </Container>
  );
};

export default LoginPage;
