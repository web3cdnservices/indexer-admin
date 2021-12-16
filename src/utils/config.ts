// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { SubqueryNetwork } from '@subql/contract-sdk';

type TConfig = {
  indexer?: string;
  network?: SubqueryNetwork;
  coordinatorEndpoint?: string;
  wsEndpoint?: string;
};

// FIXME: the values also need to save in local storage as refresh will be removed
class Config {
  static instance: Config;

  private network?: SubqueryNetwork;

  private wsEndpoint?: string;

  private indexer?: string;

  private coordinatorEndpoint?: string;

  static getInstance() {
    if (!Config.instance) {
      Config.instance = new Config();
    }
    return Config.instance;
  }

  config(configItem: TConfig) {
    const { indexer, network, wsEndpoint, coordinatorEndpoint } = configItem;
    if (network) this.network = network;
    if (wsEndpoint) this.wsEndpoint = wsEndpoint;
    if (coordinatorEndpoint) this.coordinatorEndpoint = coordinatorEndpoint;
    if (indexer) this.indexer = indexer;
  }

  getNetwork() {
    return this.network;
  }

  getWSEndpoint() {
    return this.wsEndpoint;
  }

  getIndexer() {
    return this.indexer;
  }
}

export default Config;
