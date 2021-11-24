// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

const prompts = {
  indexer: {
    title: 'Indexer Account',
    name: 'Subquery Master',
    buttonTitle: 'Unregister',
    desc: 'Staking: 10000 SQT',
  },
  controller: {
    title: 'Controller Account',
    name: 'Controller',
    buttonTitle: 'Update Controller',
    desc: 'Balance: 200 SQT',
  },
  emptyController: {
    title: 'Controller Account',
    name: '',
    buttonTitle: 'Config Controller',
    desc: 'Controller account is a delegator of the indexer, need to config a controller account before you start the journey to indexing project, controller account will config in you coordinator service and send the status of the indexing service to the contract autimatically',
  },
};

export default prompts;
