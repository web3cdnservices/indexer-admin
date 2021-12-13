// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

const prompts = {
  install: {
    title: 'Install MetaMask to use Indexer App',
    buttonTitle:
      'No MetaMask Extension found in the browser.  Please click the button to install the MetaMask Extension before connect with the network.',
    desc: '',
  },
  connect: {
    title: 'Connect wallet to use Indexer App',
    buttonTitle: 'Connect with MetaMask',
    desc: 'Use the indexer app to connect with you coordinator service and Subquery network, you can manage you accounts and projects.',
  },
  error: {
    title: 'Unsupportted network Type',
    desc: 'MetaMask connect with an unsupported network, please press the button to swith to the correct network',
    buttonTitle: 'Swtich Network',
  },
};

export default prompts;
