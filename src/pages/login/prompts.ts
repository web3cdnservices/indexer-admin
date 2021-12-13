// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

const prompts = {
  login: {
    title: 'Welcome to Indexer Admin',
    desc: "Let's connect with coordinator service to use the indexer admin",
    buttonTitle: 'Connect',
    endpoint: {
      label: 'Coordinator Service Endpoint',
      palceholder: 'http://localhost:8000',
    },
    network: {
      label: 'Network Type',
      placeholder: 'Select a network',
    },
  },
};

export default prompts;
