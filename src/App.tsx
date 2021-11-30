// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { FC } from 'react';
import { Route } from 'react-router';
import 'antd/dist/antd.css';
import { BrowserRouter as Router, Switch } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';

import './App.css';
import * as Pages from './pages';
import { Web3Provider } from './containers';
import { ContractSDKProvider } from './containers/contractSdk';
import { useClient } from './hooks/loginHook';

const App: FC = () => {
  const client = useClient();

  const renderContents = () => (
    <Router>
      <Pages.Header />
      <div className="Main">
        <Switch>
          <Route component={Pages.Projects} path="/projects" />
          <Route component={Pages.ProjectDetail} path="/project" />
          <Route component={Pages.Account} path="/account" />
          <Route component={Pages.Login} path="/" />
        </Switch>
      </div>
      <Pages.Footer />
    </Router>
  );

  return (
    <ApolloProvider client={client}>
      <Web3Provider>
        <ContractSDKProvider>
          <div className="App">{renderContents()}</div>
        </ContractSDKProvider>
      </Web3Provider>
    </ApolloProvider>
  );
};

export default App;
