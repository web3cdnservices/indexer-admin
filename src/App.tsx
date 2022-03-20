// Copyright 2020-2022 SubQuery Pte Ltd authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { FC } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';

import Loading from 'components/loading';
import Toast from 'components/toast';
import { ContractSDKProvider } from 'containers/contractSdk';
import { CoordinatorIndexerProvider } from 'containers/coordinatorIndexer';
import { LoadingProvider } from 'containers/loadingContext';
import { ToastProvider } from 'containers/toastContext';
import { Web3Provider } from 'containers/web3';
import { useShowMetaMask } from 'hooks/web3Hook';
import MetaMaskView from 'pages/metamask/metamaskView';
import { createApolloClient, defaultServiceUrl } from 'utils/apolloClient';

import * as Pages from './pages';

// FIXME: remove antd relate files
import 'antd/dist/antd.css';
import './App.css';

const AppContents = () => {
  const showMetaMask = useShowMetaMask();

  return (
    <Router>
      <Pages.Header />
      <div className="Main">
        {!showMetaMask ? (
          <Switch>
            <Route component={Pages.Projects} path="/projects" />
            <Route exact component={Pages.ProjectDetail} path="/project/:id" />
            <Route component={Pages.Account} path="/account" />
            <Route component={Pages.Register} path="/register" />
            <Route component={Pages.Login} path="/" />
          </Switch>
        ) : (
          <MetaMaskView />
        )}
        <Loading />
        <Toast />
      </div>
      <Pages.Footer />
    </Router>
  );
};

const App: FC = () => {
  const client = createApolloClient(window.env.COORDINATOR_GRAPHQL ?? defaultServiceUrl);
  return (
    <ApolloProvider client={client}>
      <Web3Provider>
        <ContractSDKProvider>
          <CoordinatorIndexerProvider>
            <LoadingProvider>
              <ToastProvider>
                <div className="App">
                  <AppContents />
                </div>
              </ToastProvider>
            </LoadingProvider>
          </CoordinatorIndexerProvider>
        </ContractSDKProvider>
      </Web3Provider>
    </ApolloProvider>
  );
};

export default App;
