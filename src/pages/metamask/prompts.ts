// Copyright 2020-2022 SubQuery Pte Ltd authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Account } from 'pages/account/types';

const prompts = (account: Account) => ({
  install: {
    title: 'Install MetaMask to use Indexer App',
    desc: 'No MetaMask Extension found in the browser.  Please click the button to install the MetaMask Extension before connect with the network.',
    buttonTitle: 'Install MetaMask in the extension market',
  },
  connect: {
    title: 'Connect wallet to use Indexer App',
    desc: 'Use the indexer app to connect with Subquery network, you can manage you accounts and projects inside the app.',
    buttonTitle: 'Connect with MetaMask browser extension',
  },
  invalidAccount: {
    title: 'Incorrect connected account with coordinator service',
    desc: `Please switch the connect account to ${account}`,
    buttonTitle: 'Switch account to use the admin app',
  },
  invalidNetwork: {
    title: 'Unsupportted network Type',
    desc: 'MetaMask connect with an unsupported network, please press the button to swith to the correct network',
    buttonTitle: 'Swtich to the supportted network',
  },
});

export default prompts;
