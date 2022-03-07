// Copyright 2020-2022 SubQuery Pte Ltd authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ClickAction, FormSubmit } from 'components/modalView';
import { ControllerFormKey, ControllerFormSchema, initialControllerValues } from 'types/schemas';
import { ActionType } from 'utils/transactions';

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
        formValues: initialControllerValues,
        schema: ControllerFormSchema,
        onFormSubmit: onUploadController,
        items: [
          {
            formKey: ControllerFormKey.privateKey,
            title: 'Controller Private Key',
          },
        ],
      },
    },
    {
      index: 1,
      title: 'Update your controller on contract',
      desc: 'Press the button to send the transaction to network and update the controller account on contract. The transaction processing time may take around 10s, it depends on the network status and gas fee. You will see the processing status on the top of the page once you confim the transaction on the MetaMask.',
      buttonTitle: 'Send Transction',
      onClick: onSendTxConfigController,
    },
  ],
});

export const createUnregisterSteps = (onUnregister: ClickAction) => ({
  [ActionType.unregister]: [
    {
      index: 1,
      title: 'Unregister from network',
      desc: `Sorry to see the indexer unregister from the Subquery Network, please note that all the data in your coordinator service will be removed, and the staking token will deposit to your current account once transction processed`,
      buttonTitle: 'Unregister',
      onClick: onUnregister,
    },
  ],
});
