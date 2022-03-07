// Copyright 2020-2022 SubQuery Pte Ltd authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { RegisterStep } from './types';

const prompts = {
  [RegisterStep.onboarding]: {
    title: 'Stake to become a Subquery Indexer',
    desc: 'Become an Indexer so you can index subquery projects. You need to stake a minimum of 1000 SQT in order to index subquery projects. Learn more about the indexer',
    buttonTitle: 'Get Started',
  },
  [RegisterStep.authorisation]: {
    title: 'Request approve authorisation',
    desc: 'Indexer Admin app need you to approve the authorisation request to deposit the SQT token into Subquery Staking contract, this is a one-time operation for the specific account. Please press the approve button then confirm and send the transaction on MetaMask.',
    buttonTitle: 'Approve',
  },
  [RegisterStep.register]: {
    title: 'Stake to become a Subquery Indexer',
    desc: '',
    // 'Become an indexer that you can index subquery project. You need to stake a minimum of 1000 SQT to index subquery project. The time for processing the transaciton dependent on the current status of the network and the gas fee, it usually takes 30 seconds',
    buttonTitle: 'Register Indexer',
  },
  [RegisterStep.sync]: {
    title: 'Sync the indexer with coordinator service',
    desc: 'This connect account has been an indexer already, please press the sync button to sync this account with you coordinator service, otherwise you can switch you account in the wallet to select the correct account.',
    buttonTitle: 'Sync',
  },
};

export default prompts;
