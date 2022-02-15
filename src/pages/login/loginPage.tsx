// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable */
import { useEffect } from 'react';
import { Redirect } from 'react-router';
import { useIsIndexer } from 'hooks/indexerHook';
import { useWeb3 } from 'hooks/web3Hook';
import MetaMaskView from 'pages/metamask/metamaskView';
import { useCoordinatorIndexer } from 'containers/coordinatorIndexer';
import { useLoading } from 'containers/loadingContext';
import { Container } from './styles';
import { isUndefined } from 'lodash';

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

  const isCorrectAccount = () => account?.toLowerCase() === coordinatorIndexer?.toLocaleLowerCase();

  const renderContent = () => (
    <div>
      {!account && <MetaMaskView />}
      {account && !isIndexer && !coordinatorIndexer && <Redirect to="/register" />}
      {account &&
        !!coordinatorIndexer &&
        (isCorrectAccount() ? <Redirect to="/account" /> : <MetaMaskView />)}
    </div>
  );

  return <Container>{!isUndefined(coordinatorIndexer) && renderContent()}</Container>;
};

export default LoginPage;
