// Copyright 2020-2022 SubQuery Pte Ltd authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { FC } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';

import Loading from 'components/loading';
import { ContractSDKProvider } from 'containers/contractSdk';
import { CoordinatorIndexerProvider } from 'containers/coordinatorIndexer';
import { LoadingProvider } from 'containers/loadingContext';
import { NotificationProvider, Notifications } from 'containers/notificationContext';
import { Web3Provider } from 'containers/web3';
import { useShowMetaMask } from 'hooks/web3Hook';
import MetaMaskView from 'pages/metamask/metamaskView';
import { coordinatorServiceUrl, createApolloClient } from 'utils/apolloClient';

import * as Pages from './pages';

import 'react-notifications-component/dist/theme.css';
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
            <Route component={Pages.Network} path="/network" />
            <Route component={Pages.Register} path="/register" />
            <Route component={Pages.Login} path="/" />
          </Switch>
        ) : (
          <MetaMaskView />
        )}
        <Notifications />
        <Loading />
      </div>
      <Pages.Footer />
    </Router>
  );
};

const App: FC = () => (
  <ApolloProvider client={createApolloClient(coordinatorServiceUrl)}>
    <Web3Provider>
      <ContractSDKProvider>
        <CoordinatorIndexerProvider>
          <LoadingProvider>
            <NotificationProvider>
              <div className="App">
                <AppContents />
              </div>
            </NotificationProvider>
          </LoadingProvider>
        </CoordinatorIndexerProvider>
      </ContractSDKProvider>
    </Web3Provider>
  </ApolloProvider>
);

export default App;
