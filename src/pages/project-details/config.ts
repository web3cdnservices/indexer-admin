// Copyright 2020-2022 SubQuery Pte Ltd authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { initialIndexingValues, ProjectFormKey, StartIndexingSchema } from 'types/schemas';
import { ClickAction, FormSubmit, ProjectAction } from 'utils/transactions';

import prompts from './prompts';

export enum ProjectStatus {
  NotIndexing,
  Started,
  Indexing,
  Ready,
  Terminated,
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

export const createServiceItem = (type: string, url: string, version: string, status: string) => ({
  url,
  imageVersion: `onfinality/subql-${type}:${version}`,
  status,
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
    createButtonItem('Publish to Ready', () => onButtonClick(ProjectAction.AnnounceReady)),
    createButtonItem('Stop Indexing', () => onButtonClick(ProjectAction.StopIndexing)),
  ],
  [ProjectStatus.Ready]: [
    createButtonItem('Restart Indexing', () => onButtonClick(ProjectAction.RestartProject)),
    createButtonItem('Stop Indexing', () => onButtonClick(ProjectAction.StopIndexing)),
  ],
  [ProjectStatus.Terminated]: [
    createButtonItem('Restart Indexing', () => onButtonClick(ProjectAction.RestartProject)),
    createButtonItem('Announce Not Indexing', () =>
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

// type ActionStep = Record<ProjectAction, StepItem[]>;

export const createStartIndexingSteps = (onStartProject: FormSubmit) => ({
  [ProjectAction.StartIndexing]: [
    {
      index: 0,
      title: prompts.startProject.title,
      desc: prompts.startProject.desc,
      buttonTitle: 'Indexing Project',
      form: {
        formValues: initialIndexingValues,
        schema: StartIndexingSchema,
        onFormSubmit: onStartProject,
        items: [
          {
            formKey: ProjectFormKey.networkEndpoint,
            title: 'Indexing Network Endpiont',
            placeholder: 'wss://polkadot.api.onfinality.io/public-ws',
          },
        ],
      },
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
      form: {
        formValues: initialIndexingValues,
        schema: StartIndexingSchema,
        onFormSubmit: onStartProject,
        items: [
          {
            formKey: ProjectFormKey.networkEndpoint,
            title: 'Indexing Network Endpiont',
            placeholder: 'wss://polkadot.api.onfinality.io/public-ws',
          },
        ],
      },
      onClick: onStartProject,
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
