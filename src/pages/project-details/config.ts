// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ClickAction, FormSubmit } from 'components/modalView';
import {
  initialPublishProjectValues,
  initialStartProjectValues,
  ProjectFormKey,
  StartProjectSchema,
} from 'types/schemas';
import { ActionType } from 'utils/transactions';

import { IndexingStatus } from '../projects/constant';

export const modalTitles = {
  [ActionType.removeProject]: 'Remove Project',
  [ActionType.startIndexing]: 'Start Indexing Project',
  [ActionType.readyIndexing]: 'Publish Indexing to Ready',
  [ActionType.stopIndexing]: 'Stop Indexing Project',
};

type TButtonItem = {
  title: string;
  action: () => void;
  color?: string;
};

const createButtonItem = (title: string, action: () => void, color?: string): TButtonItem => ({
  title,
  action,
  color,
});

export const createServiceItem = (url: string, version: string, status: string) => ({
  url,
  imageVersion: `onfinality/subql-node:${version}`,
  status,
});

export const createButtonItems = (onButtonClick: (type: ActionType) => void) => ({
  [IndexingStatus.NOTSTART]: [
    createButtonItem('Start Indexing', () => onButtonClick(ActionType.startIndexing)),
    createButtonItem('Remove Project', () => onButtonClick(ActionType.removeProject)),
  ],
  [IndexingStatus.INDEXING]: [
    createButtonItem('Publish to Ready', () => onButtonClick(ActionType.readyIndexing)),
    createButtonItem('Stop Indexing', () => onButtonClick(ActionType.stopIndexing)),
  ],
  [IndexingStatus.READY]: [
    createButtonItem('Stop Indexing', () => onButtonClick(ActionType.stopIndexing)),
  ],
  [IndexingStatus.TERMINATED]: [],
});

export const createRemoveProjectSteps = (onRemoveProject: ClickAction) => ({
  [ActionType.removeProject]: [
    {
      index: 0,
      title: 'Remove Project',
      desc: 'Remove the project from your coordinator service, you can add it back at anytime.',
      buttonTitle: 'Remove Project',
      onClick: onRemoveProject,
    },
  ],
});

export const createStartIndexingSteps = (
  onSyncIndexerEndpoint: FormSubmit,
  onSendTransaction: ClickAction
) => ({
  [ActionType.startIndexing]: [
    {
      index: 0,
      title: 'Indexer Service Endpiont',
      desc: 'Upload the indexer service endpoint to you coordinator service, this endpoint will be used to get the metadata of the indexer service and monitor the health.',
      buttonTitle: 'Sync Endpoint',
      form: {
        formKey: ProjectFormKey.indexerEndpoint,
        formValues: initialStartProjectValues,
        schema: StartProjectSchema,
        onFormSubmit: onSyncIndexerEndpoint,
      },
    },
    {
      index: 1,
      title: 'Start Indexing Project',
      desc: 'Send transaction to the network to update the controller, the transaction processing time may take around 10s, it depends on the network and gas fee.',
      buttonTitle: 'Send Transction',
      onClick: onSendTransaction,
    },
  ],
});

export const createReadyIndexingSteps = (
  onSyncQueryEndpoint: FormSubmit,
  onSendTransaction: ClickAction
) => ({
  [ActionType.readyIndexing]: [
    {
      index: 0,
      title: 'Query Service Endpoint',
      desc: 'Upload the query service endpoint to you coordinator service, this endpoint will be used to get the metadata of the query service and monitor the health.',
      buttonTitle: 'Sync Endpoint',
      form: {
        formKey: ProjectFormKey.queryEndpoint,
        formValues: initialPublishProjectValues,
        schema: initialPublishProjectValues,
        onFormSubmit: onSyncQueryEndpoint,
      },
    },
    {
      index: 1,
      title: 'Update Indexing To Ready',
      desc: 'Send transaction to the network to update the controller, the transaction processing time may take around 10s, it depends on the network and gas fee.',
      buttonTitle: 'Send Transction',
      onClick: onSendTransaction,
    },
  ],
});

export const createStopIndexingSteps = (onSendTransaction: ClickAction) => ({
  [ActionType.stopIndexing]: [
    {
      index: 0,
      title: 'Stop Indexing Project',
      desc: 'Sorry to see this project will be terminated from the Subquery Network, please confirm the action and press the button to send the transaction.',
      buttonTitle: 'Stop Indexing',
      onClick: onSendTransaction,
    },
  ],
});
