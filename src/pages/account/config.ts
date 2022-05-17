// Copyright 2020-2022 SubQuery Pte Ltd authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Notification } from 'containers/notificationContext';
import { AccountAction, ClickAction, FormSubmit } from 'pages/project-details/types';
import {
  ControllerFormKey,
  ControllerFormSchema,
  initialControllerValues,
  initialMetadataValues,
  MetadataFormKey,
  MetadataFormSchema,
} from 'types/schemas';
import { dismiss } from 'utils/notification';

import { IndexerMetadata } from './types';

const buttonTitles = {
  [AccountAction.unregister]: 'Unregister',
  [AccountAction.configCntroller]: 'Config Controller',
  [AccountAction.updateMetaData]: 'Update Metadata',
};

export const createButonItem = (
  actionType: AccountAction,
  onClick: (type: AccountAction) => void
) => {
  return {
    title: buttonTitles[actionType],
    type: actionType,
    onClick,
  };
};

export const AccountActionName = {
  [AccountAction.configCntroller]: 'Config Controller Account',
  [AccountAction.updateMetaData]: 'Update Indexer Metadata',
  [AccountAction.unregister]: 'Unregister Indexer Account',
};

export const createControllerSteps = (
  onUploadController: FormSubmit,
  onSendTxConfigController: ClickAction
) => ({
  // FIXME: move descriptions to `prompts`
  [AccountAction.configCntroller]: [
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
            placeholder: '0x5fb92d6e98884f76de468fa3f6278f8807c48bebc13595d45af5bdc4da702133',
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
  [AccountAction.unregister]: [
    {
      index: 0,
      title: 'Unregister from network',
      desc: `Sorry to see the indexer unregister from the Subquery Network, please note that all the data in your coordinator service will be removed, and the staking token will deposit to your current account once transction processed`,
      buttonTitle: 'Unregister',
      onClick: onUnregister,
    },
  ],
});

export const createUpdateMetadataSteps = (onUpdate: FormSubmit, metadata?: IndexerMetadata) => ({
  [AccountAction.updateMetaData]: [
    {
      index: 0,
      title: 'Update Indexer Metadata',
      desc: `Input valid indexer name and proxy server endpoint to update the metadata, make sure the proxy endpoint is valid`,
      buttonTitle: 'Update Metadata',
      form: {
        formValues: initialMetadataValues(metadata),
        schema: MetadataFormSchema,
        onFormSubmit: onUpdate,
        items: [
          {
            formKey: MetadataFormKey.name,
            title: 'Indexer Name',
          },
          {
            formKey: MetadataFormKey.proxyEndpoint,
            title: 'Proxy Server Endpoint',
          },
        ],
      },
    },
  ],
});

// notifications

export const configControllerSucceed = (controller: string): Notification => ({
  type: 'success',
  title: 'Sync Controller Succeed',
  message: `Config controller: ${controller} in coordinator service successfully`,
  dismiss: dismiss(),
});

export const configControllerFailed = (controller: string): Notification => ({
  type: 'danger',
  title: 'Sync Controller Failed',
  message: `Config controller: ${controller} in coordinator service Failed`,
  dismiss: dismiss(),
});
