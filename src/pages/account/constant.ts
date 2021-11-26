// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { createStepItem, ClickAction } from '../../components/modalView';
import { ActionType } from '../../utils/transactions';
import { FormKey } from '../projects/constant';

export const modalTitles = {
  [ActionType.configCntroller]: 'Config Controller Account',
  [ActionType.unregister]: 'Unregister Indexer Account',
};

export const createControllerSteps = (
  onUploadController: ClickAction,
  onSendTxConfigController: ClickAction
) => ({
  [ActionType.configCntroller]: [
    createStepItem(
      0,
      'Controller Private Key',
      'Upload your controller private key to the coordinator service, the private key will be encrypted and save in you service db',
      'Add Controller',
      onUploadController,
      true,
      FormKey.CONFIG_CONTROLLER
    ),
    createStepItem(
      0,
      'Update your controller to contract',
      'Send transaction to the network to update the controller, the transaction processing time may take around 10s, it depends on the network and gas fee.',
      'Send Transction',
      onSendTxConfigController,
      false
    ),
  ],
});

export const createUnregisterSteps = (onUnregister: ClickAction) => ({
  [ActionType.unregister]: [
    createStepItem(
      0,
      'Unregister from Network',
      `Sorry to see the indexer unregister from the Subquery Network, please note that the staking token will deposit to your current account once transction processed`,
      'Unregister',
      onUnregister,
      false
    ),
  ],
});
