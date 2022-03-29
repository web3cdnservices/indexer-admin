// Copyright 2020-2022 SubQuery Pte Ltd authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Notification } from 'containers/notificationContext';
import { initialIndexingValues, ProjectFormKey, StartIndexingSchema } from 'types/schemas';
import { dismiss, ProjectNotification } from 'utils/notification';
import { ClickAction, FormSubmit, ProjectAction } from 'utils/transactions';

import prompts from './prompts';

export enum ProjectStatus {
  NotIndexing = 'NOT INDEXING',
  Started = 'STARTED',
  Indexing = 'INDEXING',
  Ready = 'READY',
  Terminated = 'TERMINATED',
}

export type TransactionType =
  | ProjectAction.AnnounceIndexing
  | ProjectAction.AnnounceReady
  | ProjectAction.AnnounceNotIndexing;

type ButtonItem = {
  title: string;
  action: () => void;
  color?: string;
};

const createButtonItem = (title: string, action: () => void, color?: string): ButtonItem => ({
  title,
  action,
  color,
});

export const createButtonItems = (onButtonClick: (type: ProjectAction) => void) => ({
  [ProjectStatus.NotIndexing]: [
    createButtonItem('Start Indexing', () => onButtonClick(ProjectAction.StartIndexing)),
  ],
  [ProjectStatus.Started]: [
    createButtonItem('Announce Indexing', () => onButtonClick(ProjectAction.AnnounceIndexing)),
    createButtonItem('Stop Project', () => onButtonClick(ProjectAction.StopProject)),
  ],
  [ProjectStatus.Indexing]: [
    createButtonItem('Restart Indexing', () => onButtonClick(ProjectAction.RestartProject)),
    createButtonItem('Announce Ready', () => onButtonClick(ProjectAction.AnnounceReady)),
    createButtonItem('Stop Indexing', () => onButtonClick(ProjectAction.StopIndexing)),
  ],
  [ProjectStatus.Ready]: [
    createButtonItem('Restart Indexing', () => onButtonClick(ProjectAction.RestartProject)),
    createButtonItem('Stop Indexing', () => onButtonClick(ProjectAction.StopIndexing)),
  ],
  [ProjectStatus.Terminated]: [
    createButtonItem('Restart Indexing', () => onButtonClick(ProjectAction.RestartProject)),
    createButtonItem('Announce NotIndexing', () =>
      onButtonClick(ProjectAction.AnnounceNotIndexing)
    ),
  ],
});

export const modalTitles = {
  [ProjectAction.StartIndexing]: 'Start Indexing Project',
  [ProjectAction.RestartProject]: 'Restart Indexing Project',
  [ProjectAction.AnnounceIndexing]: 'Announce Indexing Project',
  [ProjectAction.AnnounceReady]: 'Publish Indexing to Ready',
  [ProjectAction.StopProject]: 'Stop Project',
  [ProjectAction.AnnounceNotIndexing]: 'Announce Not Indexing Project',
  [ProjectAction.StopIndexing]: 'Stop Indexing',
};

const startProjectForms = (onFormSubmit: FormSubmit) => ({
  formValues: initialIndexingValues,
  schema: StartIndexingSchema,
  onFormSubmit,
  items: [
    {
      formKey: ProjectFormKey.networkEndpoint,
      title: 'Indexing Network Endpiont',
      placeholder: 'wss://polkadot.api.onfinality.io/public-ws',
    },
    {
      formKey: ProjectFormKey.networkDictionary,
      title: 'Network Dictionary Endpiont',
      placeholder: 'https://api.subquery.network/sq/subquery/dictionary-polkadot',
    },
  ],
});

export const createStartIndexingSteps = (onStartProject: FormSubmit) => ({
  [ProjectAction.StartIndexing]: [
    {
      index: 0,
      title: prompts.startProject.title,
      desc: prompts.startProject.desc,
      buttonTitle: 'Indexing Project',
      form: startProjectForms(onStartProject),
      onClick: onStartProject,
    },
  ],
});

export const createRestartProjectSteps = (onStartProject: FormSubmit) => ({
  [ProjectAction.RestartProject]: [
    {
      index: 0,
      title: prompts.restartProject.title,
      desc: prompts.restartProject.desc,
      buttonTitle: 'Restart Project',
      form: startProjectForms(onStartProject),
    },
  ],
});

export const createAnnounceIndexingSteps = (onSendTransaction: ClickAction) => ({
  [ProjectAction.AnnounceIndexing]: [
    {
      index: 0,
      title: prompts.announceIndexing.title,
      desc: prompts.announceIndexing.desc,
      buttonTitle: 'Send Transction',
      onClick: onSendTransaction,
    },
  ],
});

export const createReadyIndexingSteps = (onSendTransaction: ClickAction) => ({
  [ProjectAction.AnnounceReady]: [
    {
      index: 0,
      title: prompts.announceReady.title,
      desc: prompts.announceReady.desc,
      buttonTitle: 'Send Transction',
      onClick: onSendTransaction,
    },
  ],
});

export const createNotIndexingSteps = (onSendTransaction: ClickAction) => ({
  [ProjectAction.AnnounceNotIndexing]: [
    {
      index: 0,
      title: prompts.announceNotIndexing.title,
      desc: prompts.announceNotIndexing.desc,
      buttonTitle: 'Send Transction',
      onClick: onSendTransaction,
    },
  ],
});

export const createStopProjectSteps = (onStopProject: ClickAction) => ({
  [ProjectAction.StopProject]: [
    {
      index: 0,
      title: prompts.stopProject.title,
      desc: prompts.stopProject.desc,
      buttonTitle: 'Stop Project',
      onClick: onStopProject,
    },
  ],
});

export const createStopIndexingSteps = (
  onStopProject: ClickAction,
  onSendTransaction: ClickAction
) => ({
  [ProjectAction.StopIndexing]: [
    {
      index: 0,
      title: prompts.stopProject.title,
      desc: prompts.stopProject.desc,
      buttonTitle: 'Stop Indexing',
      onClick: onStopProject,
    },
    {
      index: 1,
      title: prompts.announceNotIndexing.title,
      desc: prompts.announceNotIndexing.desc,
      buttonTitle: 'Send Transction',
      onClick: onSendTransaction,
    },
  ],
});

// inconsistent status config
export const aletMessages = {
  [ProjectStatus.Started]: {
    title: 'Ready to indexing the project on Suquery Network',
    description:
      'The current project has been alreay started, check the progress and logs make sure indexing is alright. Try press the Announce Indexing button to annouce indexing this project on Subquery Network. You can also try to restart indexing if something wrong happens.',
  },
  [ProjectStatus.Terminated]: {
    title: 'Status Inconsistent',
    description:
      'The current indexing service for this project is terminated but the indexing service status on Subquery Network is still INDEXING, we encourage you to press the Announce NotIndexing button to change the online status to NOTINDEXING as well',
  },
};

// notification config
export const notifications: Record<string, Notification> = {
  [ProjectNotification.Started]: {
    type: 'success',
    title: 'Project is starting',
    message: `Starting project may take around 5 senconds`,
    dismiss: dismiss(),
  },
  [ProjectNotification.Terminated]: {
    type: 'success',
    title: 'Project Terminated',
    message: `The project has been stopped, you can restart or update the status on network to not indexing`,
    dismiss: dismiss(),
  },
};
