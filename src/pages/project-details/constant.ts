// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ClickAction, createStepItem } from '../../components/modalView';
import { ActionType } from '../../utils/transactions';
import { FormKey } from '../projects/constant';

export const createButtonItem = (title: string, action: () => void, color?: string) => ({
  title,
  action,
  color,
});

export const createStartIndexingSteps = (
  onSyncIndexerEndpoint: ClickAction,
  onSendTransaction: ClickAction
) => ({
  [ActionType.startIndexing]: [
    createStepItem(
      0,
      'Indexer Service Endpiont',
      'Upload the indexer service endpoint to you coordinator service, this endpoint will be used to get the metadata of the indexer service and monitor the health.',
      'Sync Endpoint',
      onSyncIndexerEndpoint,
      true,
      FormKey.START_PROJECT,
      'https://api.subquery.network/sq/AcalaNetwork/karura'
    ),
    createStepItem(
      1,
      'Start Indexing Project',
      'Send transaction to the network to update the controller, the transaction processing time may take around 10s, it depends on the network and gas fee.',
      'Send Transction',
      onSendTransaction,
      false
    ),
  ],
});

export const createReadyIndexingSteps = (
  onSyncQueryEndpoint: ClickAction,
  onSendTransaction: ClickAction
) => ({
  [ActionType.readyIndexing]: [
    createStepItem(
      0,
      'Query Service Endpoint',
      'Upload the query service endpoint to you coordinator service, this endpoint will be used to get the metadata of the query service and monitor the health.',
      'Sync Endpoint',
      onSyncQueryEndpoint,
      true,
      FormKey.UPDATE_PROJECT_READY,
      'https://api.subquery.network/sq/AcalaNetwork/karura'
    ),
    createStepItem(
      1,
      'Update Indexing To Ready',
      'Send transaction to the network to update the controller, the transaction processing time may take around 10s, it depends on the network and gas fee.',
      'Send Transction',
      onSendTransaction,
      false
    ),
  ],
});

export const createStopIndexingSteps = (onSendTransaction: ClickAction) => ({
  [ActionType.stopIndexing]: [
    createStepItem(
      0,
      'Stop Indexing Project',
      'Sorry to see this project will be terminated from the Subquery Network, please confirm the action and press the button to send the transaction.',
      'Stop Indexing',
      onSendTransaction,
      false
    ),
  ],
});
