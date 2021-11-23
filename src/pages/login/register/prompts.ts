// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { RegisterStep } from './types';

const prompts = {
  [RegisterStep.onboarding]: {
    title: 'Stake to become a Subquery Indexer',
    desc: 'Become an Indexer so you can index subquery projects. You need to stake a minimum of 1000 SQT to index subquery projects. Learn more about the indexer',
    buttonTitle: 'Get Started',
  },
  [RegisterStep.authorisation]: {
    title: 'Request approve authorisation',
    desc: 'Indexer Admin app need your to approve the authorisation request',
    buttonTitle: 'Approve',
  },
  [RegisterStep.register]: {
    title: 'Stake to become a Subquery Indexer',
    desc: 'Become an indexer that you can index subquery project. You need to stake a minimum of 1000 SQT to index subquery project',
    buttonTitle: 'Register Indexer',
  },
  [RegisterStep.sync]: {
    title: 'Sync indexer with coordinator service',
    desc: 'Add you indexer account to coordinator service',
    buttonTitle: 'Sync',
  },
};

export default prompts;
