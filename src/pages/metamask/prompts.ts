// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

const prompts = {
  install: {
    title: 'No MetaMask Extension found in the browser',
    buttonTitle: 'Install MetaMask Extension',
    desc: '',
  },
  connect: {
    title: 'Connect wallet to use Indexer Admin',
    buttonTitle: 'Connect with MetaMask',
    desc: '',
  },
  error: {
    title: 'Unsupportted network Type',
    // FIXME: `the correct network` -> the network type get from coordinator service
    desc: 'Please press the button to swith to the correct network',
    buttonTitle: 'Swtich Network',
  },
};

export default prompts;
