// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { FC } from 'react';
import { Route } from 'react-router';
import 'antd/dist/antd.css';
import { BrowserRouter as Router, Switch } from 'react-router-dom';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

import './App.css';
import * as Pages from './pages';
import { Web3Provider } from './containers';
import { contractSDKOptions, ContractSDKProvider } from './containers/contractSdk';

const client = new ApolloClient({
  uri: 'http://localhost:3001/graphql',
  cache: new InMemoryCache(),
});

const App: FC = () => (
  <ApolloProvider client={client}>
    <Web3Provider>
      <ContractSDKProvider initialState={contractSDKOptions}>
        <div className="App">
          <Pages.Header />
          <Router>
            <div className="Main">
              <Switch>
                <Route component={Pages.Projects} path="/projects" />
                <Route component={Pages.ProjectDetail} path="/project" />
                <Route component={Pages.Account} path="/account" />
                <Route component={Pages.Login} path="/" />
              </Switch>
            </div>
          </Router>
          <Pages.Footer />
        </div>
      </ContractSDKProvider>
    </Web3Provider>
  </ApolloProvider>
);

export default App;
