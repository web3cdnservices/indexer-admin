// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ClickAction, FormSubmit } from 'components/modalView';
import { ConfigServicesSchema, initialServiceValues, ProjectFormKey } from 'types/schemas';
import { ActionType } from 'utils/transactions';

import { IndexingStatus } from '../projects/constant';

export const modalTitles = {
  [ActionType.removeProject]: 'Remove Project',
  [ActionType.configServices]: 'Config Project Services',
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

export const createServiceItem = (type: string, url: string, version: string, status: string) => ({
  url,
  imageVersion: `onfinality/subql-${type}:${version}`,
  status,
});

export const createButtonItems = (onButtonClick: (type: ActionType) => void) => ({
  [IndexingStatus.NOTSTART]: [
    // createButtonItem('Config Services', () => onButtonClick(ActionType.configServices)),
    createButtonItem('Start Indexing', () => onButtonClick(ActionType.startIndexing)),
    // createButtonItem('Remove Project', () => onButtonClick(ActionType.removeProject)),
  ],
  [IndexingStatus.INDEXING]: [
    createButtonItem('Publish to Ready', () => onButtonClick(ActionType.readyIndexing)),
    createButtonItem('Stop Indexing', () => onButtonClick(ActionType.stopIndexing)),
  ],
  [IndexingStatus.READY]: [
    createButtonItem('Stop Indexing', () => onButtonClick(ActionType.stopIndexing)),
  ],
  [IndexingStatus.TERMINATED]: [
    // createButtonItem('Config Services', () => onButtonClick(ActionType.configServices)),
    createButtonItem('Start Indexing', () => onButtonClick(ActionType.startIndexing)),
  ],
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

export const createConfigServicesSteps = (onSyncIndexerEndpoint: FormSubmit) => ({
  [ActionType.configServices]: [
    {
      index: 0,
      title: 'Indexer Service Endpiont',
      desc: 'Upload the indexer endpoint and query endpoint to you coordinator service.',
      buttonTitle: 'Sync Endpoint',
      form: {
        formValues: initialServiceValues,
        schema: ConfigServicesSchema,
        onFormSubmit: onSyncIndexerEndpoint,
        items: [
          {
            formKey: ProjectFormKey.indexerEndpoint,
            title: 'Indexer Service Endpiont',
            placeholder: 'https://api.subquery.network/example',
          },
          {
            formKey: ProjectFormKey.queryEndpoint,
            title: 'Query Service Endpiont',
            placeholder: 'https://api.subquery.network/example',
          },
        ],
      },
    },
  ],
});

export const createStartIndexingSteps = (
  onStartProject: ClickAction,
  onSendTransaction: ClickAction
) => ({
  [ActionType.startIndexing]: [
    {
      index: 0,
      title: 'Start Indexing Project',
      desc: 'Start indexing project will start the subquery node service indexing the project and start a query service at the same time. It takes around 1 mins to start the services, you can see the progress and related information after everything is ready.',
      buttonTitle: 'Indexing Project',
      onClick: onStartProject,
    },
    {
      index: 1,
      title: 'Update Status on Subquery Network',
      desc: 'Send transaction to start indexing the project on contract, the controller account on coordinator service will start to update the status of indexing service on the contract once the transaction completed. The transaction processing time may take around 10s, it depends on the network and gas fee. You will see the processing status on the top of the page once you confim the transaction on the MetaMask.',
      buttonTitle: 'Send Transction',
      onClick: onSendTransaction,
    },
  ],
});

export const createReadyIndexingSteps = (onSendTransaction: ClickAction) => ({
  [ActionType.readyIndexing]: [
    {
      index: 0,
      title: 'Update Indexing To Ready',
      desc: 'Send transaction to change indexing status to ready on contract, the explorer will display you query endpoint once the transaction completed. The transaction processing time may take around 10s, it depends on the network and gas fee. You will see the processing status on the top of the page once you confim the transaction on the MetaMask.',
      buttonTitle: 'Send Transction',
      onClick: onSendTransaction,
    },
  ],
});

export const createStopIndexingSteps = (
  onStartProject: ClickAction,
  onSendTransaction: ClickAction
) => ({
  [ActionType.stopIndexing]: [
    {
      index: 0,
      title: 'Stop Indexing Project',
      desc: 'Stop indexing project will stop the subquery node service and query service, you can restart indexing the project at any time. It takes around 1 mins to start the services.',
      buttonTitle: 'Stop Project',
      onClick: onStartProject,
    },
    {
      index: 1,
      title: 'Update Status on Subquery Network',
      desc: 'Sorry to see this project will be terminated from the Subquery Network, please note that the service endpoint for this project will also be removed once the transaction processed. The transaction processing time may take around 10s, it depends on the network and gas fee. You will see the processing status on the top of the page once you confim the transaction on the MetaMask.',
      buttonTitle: 'Send Transction',
      onClick: onSendTransaction,
    },
  ],
});
