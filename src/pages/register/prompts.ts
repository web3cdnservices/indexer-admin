// Copyright 2020-2021 OnFinality Limited authors & contributors
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
    desc: 'Indexer Admin app need your to approve the authorisation request, Indexer Admin Admin app need your to approve the authorisation request. The time for processing the transaciton dependent on the current status of the network and the gas fee, it usually takes 30 seconds',
    buttonTitle: 'Approve',
  },
  [RegisterStep.register]: {
    title: 'Stake to become a Subquery Indexer',
    desc: 'Become an indexer that you can index subquery project. You need to stake a minimum of 1000 SQT to index subquery project. The time for processing the transaciton dependent on the current status of the network and the gas fee, it usually takes 30 seconds',
    buttonTitle: 'Register Indexer',
  },
  [RegisterStep.sync]: {
    title: 'Sync indexer with coordinator service',
    desc: 'Add you indexer account to coordinator service, become an indexer that you can index subquery project. You need to stake a minimum of 1000 SQT to index subquery project',
    buttonTitle: 'Sync',
  },
};

export default prompts;
