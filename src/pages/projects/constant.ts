// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { FormSubmit } from '../../components/modalView';
import { ProjectFormKey, initialProjectValues, ProjectFormSchema } from '../../types/schemas';
import { ActionType } from '../../utils/transactions';

export enum IndexingStatus {
  NOTSTART,
  INDEXING,
  READY,
  TERMINATED,
}

export const statusColor = {
  [IndexingStatus.NOTSTART]: '#E4E4E4',
  [IndexingStatus.INDEXING]: 'rgba(67, 136, 221, 0.24)',
  [IndexingStatus.READY]: 'rgba(70, 219, 103, 0.4)',
  [IndexingStatus.TERMINATED]: 'rgba(214, 48, 48, 0.3)',
};

export const statusText = {
  [IndexingStatus.NOTSTART]: 'Not Started',
  [IndexingStatus.INDEXING]: 'Indexing',
  [IndexingStatus.READY]: 'Ready',
  [IndexingStatus.TERMINATED]: 'Stop',
};

export const createAddProjectSteps = (onAddProject: FormSubmit) => ({
  [ActionType.addProject]: [
    {
      index: 0,
      title: 'Add new project',
      desc: 'Upload the query service endpoint to you coordinator service, this endpoint will be used to get the metadata of the query service and monitor the health.',
      buttonTitle: 'Sync Endpoint',
      form: {
        formKey: ProjectFormKey.deploymentId,
        formValues: initialProjectValues,
        schema: ProjectFormSchema,
        onFormSubmit: onAddProject,
      },
    },
  ],
});
