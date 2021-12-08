// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ClickAction, FormSubmit } from '../../components/modalView';
import { ActionType } from '../../utils/transactions';
import {
  initialControllerValues,
  ControllerFormKey,
  ControllerFormSchema,
} from '../../types/schemas';

export const modalTitles = {
  [ActionType.configCntroller]: 'Config Controller Account',
  [ActionType.unregister]: 'Unregister Indexer Account',
};

export const createControllerSteps = (
  onUploadController: FormSubmit,
  onSendTxConfigController: ClickAction
) => ({
  // FIXME: move descriptions to `prompts`
  [ActionType.configCntroller]: [
    {
      index: 0,
      title: 'Controller Private Key',
      desc: 'Upload your controller private key to the coordinator service, the private key will be encrypted and save in you service db',
      buttonTitle: 'Add Controller',
      form: {
        formKey: ControllerFormKey.privateKey,
        formValues: initialControllerValues,
        schema: ControllerFormSchema,
        onFormSubmit: onUploadController,
      },
    },
    {
      index: 1,
      title: 'Update your controller to contract',
      desc: 'Send transaction to the network to update the controller, the transaction processing time may take around 10s, it depends on the network and gas fee.',
      buttonTitle: 'Send Transction',
      onClick: onSendTxConfigController,
    },
  ],
});

export const createUnregisterSteps = (
  onRemoveAccounts: ClickAction,
  onUnregister: ClickAction
) => ({
  [ActionType.unregister]: [
    {
      indexer: 0,
      title: 'Remove accounts from Server',
      desc: 'To unregister from the network, need to remove all the accounts from you coordinator server',
      buttonTitle: 'Remove Accounts',
      onClick: onRemoveAccounts,
    },
    {
      index: 1,
      title: 'Unregister from Network',
      desc: `Sorry to see the indexer unregister from the Subquery Network, please note that the staking token will deposit to your current account once transction processed`,
      buttonTitle: 'Unregister',
      onClick: onUnregister,
    },
  ],
});
