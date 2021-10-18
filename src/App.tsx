// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { VFC } from 'react';
import { Route } from 'react-router';
import { BrowserRouter as Router, Switch } from 'react-router-dom';

import './App.css';
import * as Pages from './pages';
import { Web3Provider } from './containers';

const App: VFC = () => (
  <Web3Provider>
    <div className="App">
      <Router>
        <div className="Main">
          <Switch>
            <Route component={Pages.Projects} path="/projects" />
            <Route component={Pages.Registry} path="/registry" />
          </Switch>
        </div>
      </Router>
    </div>
  </Web3Provider>
);

export default App;
