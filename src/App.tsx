// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { FC } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';

import Loading from 'components/loading';
import Toast from 'components/toast';
import { Web3Provider } from 'containers';
import { ContractSDKProvider } from 'containers/contractSdk';
import { LoadingProvider } from 'containers/loadingContext';
import { ToastProvider } from 'containers/toastContext';
import { createApolloClient } from 'utils/apolloClient';

import * as Pages from './pages';

import 'antd/dist/antd.css';
import './App.css';

const AppContents = () => (
  <Router>
    <Pages.Header />
    <div className="Main">
      <Switch>
        <Route component={Pages.Projects} path="/projects" />
        <Route exact component={Pages.ProjectDetail} path="/project/:id" />
        <Route component={Pages.Account} path="/account" />
        <Route component={Pages.Login} path="/" />
      </Switch>
      <Loading />
      <Toast />
    </div>
    <Pages.Footer />
  </Router>
);

const App: FC = () => {
  return (
    <ApolloProvider client={createApolloClient()}>
      <Web3Provider>
        <ContractSDKProvider>
          <LoadingProvider>
            <ToastProvider>
              <div className="App">
                <AppContents />
              </div>
            </ToastProvider>
          </LoadingProvider>
        </ContractSDKProvider>
      </Web3Provider>
    </ApolloProvider>
  );
};

export default App;
