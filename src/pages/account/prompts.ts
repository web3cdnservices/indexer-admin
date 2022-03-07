// Copyright 2020-2022 SubQuery Pte Ltd authors & contributors
// SPDX-License-Identifier: Apache-2.0

const prompts = {
  indexer: {
    title: 'Indexer Account',
    name: 'Subquery Master',
    buttonTitle: 'Unregister',
    desc: '',
  },
  controller: {
    title: 'Controller Account',
    name: 'Controller',
    buttonTitle: 'Update Controller',
    desc: '',
  },
  emptyController: {
    title: 'Controller Account',
    name: '',
    buttonTitle: 'Config Controller',
    desc: 'Controller account is a delegator of the indexer, need to config a controller account before you start the journey to indexing the projects, controller account will config in you coordinator service and send the status of the indexing services to the contract autimatically',
  },
};

export default prompts;
