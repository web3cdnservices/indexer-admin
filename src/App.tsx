// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { FC } from 'react';
import { Route } from 'react-router';
import { BrowserRouter as Router, Switch } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';

import { ContractSDKProvider } from './containers/contractSdk';
import { createApolloClient } from './utils/apolloClient';
import { Web3Provider } from './containers';
import * as Pages from './pages';

import 'antd/dist/antd.css';
import './App.css';

const App: FC = () => {
  const renderContents = () => (
    <Router>
      <Pages.Header />
      <div className="Main">
        <Switch>
          <Route component={Pages.Projects} path="/projects" />
          <Route exact component={Pages.ProjectDetail} path="/project/:id" />
          <Route component={Pages.Account} path="/account" />
          <Route component={Pages.Login} path="/" />
        </Switch>
      </div>
      <Pages.Footer />
    </Router>
  );

  return (
    <ApolloProvider client={createApolloClient()}>
      <Web3Provider>
        <ContractSDKProvider>
          <div className="App">{renderContents()}</div>
        </ContractSDKProvider>
      </Web3Provider>
    </ApolloProvider>
  );
};

export default App;
