// Copyright 2020-2022 SubQuery Pte Ltd authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { NOTIFICATION_TYPE } from 'react-notifications-component';

export const prompts = {
  header: {
    mainTitle: 'Manage Controller Accounts',
    title: 'Create and manange your controller accounts here',
    subTitle:
      'You can Configure the account you wish to set as the controller on the coordinator services',
    button: 'Create an Account',
  },
  intro: {
    title: 'Manage Controller Accounts',
    desc: 'You can create as manay accounts as you want. You can then configure the one you wish to set as the controller on coordinator services.',
    buttonTitle: 'Create an Account',
  },
  action: {
    configController: {
      title: 'Update your controller on contract',
      desc: 'Press the button to send the transaction to network and update the new controller account on contract. The transaction processing time may take around 10s, it depends on the network status and gas fee. You will see the processing status on the top of the page once you confim the transaction on the MetaMask.',
      buttonTitle: 'Send Transction',
    },
    removeAccount: {
      title: 'Remove this account',
      desc: 'You will not be able to find this account again once you confirm removal. Are you sure you want to remove it?',
      buttonTitle: 'Confirm Removal',
    },
    withdraw: {
      title: 'Withdraw from controller account',
      desc: 'You are about to withdraw the full balance from this account to your index account. The amount you receive will be the full balance minus the transaction fee. Transaction fee is determined by the network.',
      buttonTitle: 'Confirm Withdrawl',
    },
  },
  notification: {
    widthdraw: {
      loading: {
        type: 'default' as NOTIFICATION_TYPE,
        title: 'Controller withdrawl',
        message: (c: string) => `Withdraw all the asset for controller: ${c}  may take 20s`,
      },
      success: {
        type: 'success' as NOTIFICATION_TYPE,
        title: 'Controller withdrawl Succeed',
        message: (c: string) => `Withdraw controller: ${c} assets successfully`,
      },
      failed: {
        type: 'danger' as NOTIFICATION_TYPE,
        title: 'Controller withdrawl Failed',
        message: (c: string) => `Withdraw controller: ${c} assets failed`,
      },
    },
  },
};
