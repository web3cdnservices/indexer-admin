// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Account } from 'hooks/indexerHook';

const prompts = (account: Account) => ({
  install: {
    title: 'Install MetaMask to use Indexer App',
    buttonTitle: 'Install MetaMask in the extension market',
    desc: 'No MetaMask Extension found in the browser.  Please click the button to install the MetaMask Extension before connect with the network.',
  },
  connect: {
    title: 'Connect wallet to use Indexer App',
    buttonTitle: 'Connect with MetaMask browser extension',
    desc: 'Use the indexer app to connect with Subquery network, you can manage you accounts and projects inside the app.',
  },
  invalidAccount: {
    title: 'Incorrect connected account with coordinator service',
    buttonTitle: 'Switch account to use the admin app',
    desc: `Please switch the connect account to ${account}`,
  },
  invalidNetwork: {
    title: 'Unsupportted network Type',
    desc: 'MetaMask connect with an unsupported network, please press the button to swith to the correct network',
    buttonTitle: 'Swtich to the supportted network',
  },
});

export default prompts;
