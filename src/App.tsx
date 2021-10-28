// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { FC } from 'react';
import { Route } from 'react-router';
import { BrowserRouter as Router, Switch } from 'react-router-dom';

import './App.css';
import * as Pages from './pages';
import { Web3Provider } from './containers';
import { contractSDKOptions, ContractSDKProvider } from './containers/contractSdk';
import StatusBar from './components/statusBar';

const App: FC = () => (
  <Web3Provider>
    <ContractSDKProvider initialState={contractSDKOptions}>
      <div className="App">
        <StatusBar />
        <Router>
          <div className="Main">
            <Switch>
              <Route component={Pages.Projects} path="/projects" />
              <Route component={Pages.Registry} path="/registry" />
            </Switch>
          </div>
        </Router>
      </div>
    </ContractSDKProvider>
  </Web3Provider>
);

export default App;
