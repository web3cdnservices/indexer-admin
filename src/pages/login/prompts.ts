// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

const prompts = {
  login: {
    title: 'Welcome to Indexer Admin',
    desc: "Let's connect with coordinator service to use the indexer admin",
    buttonTitle: 'Connect',
  },
  metamask: {
    install: {
      title: 'No MetaMask Extension found in the browser',
      buttonTitle: 'Install MetaMask Extension',
    },
    connect: {
      title: 'Connect wallet to use Indexer Admin',
      buttonTitle: 'Connect with MetaMask',
    },
  },
};

export default prompts;
