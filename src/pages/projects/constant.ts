// Copyright 2020-2022 SubQuery Pte Ltd authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { initialProjectValues, ProjectFormKey, ProjectFormSchema } from 'types/schemas';
import { FormSubmit, ProjectsAction } from 'utils/transactions';

export enum IndexingStatus {
  NOTINDEXING,
  INDEXING,
  READY,
}

export const statusColor = {
  [IndexingStatus.NOTINDEXING]: 'rgba(214, 48, 48, 0.3)',
  [IndexingStatus.INDEXING]: 'rgba(67, 136, 221, 0.24)',
  [IndexingStatus.READY]: 'rgba(70, 219, 103, 0.4)',
};

export const statusText = {
  [IndexingStatus.NOTINDEXING]: 'NOT INDEXING',
  [IndexingStatus.INDEXING]: 'INDEXING',
  [IndexingStatus.READY]: 'READY',
};

// TODO: remove the old logic
export const createAddProjectSteps = (onAddProject: FormSubmit) => ({
  [ProjectsAction.addProject]: [
    {
      index: 0,
      title: 'Add new project',
      desc: 'Input the deployment id, and add the project into you service. Your can manage the project in the projects page and start indexing the project at any time you want.',
      buttonTitle: 'Add project',
      form: {
        formValues: initialProjectValues,
        schema: ProjectFormSchema,
        onFormSubmit: onAddProject,
        items: [
          {
            formKey: ProjectFormKey.deploymentId,
            title: 'Add new project',
            placeholder: 'QmYDpk94SCgxv4j2PyLkaD8fWJpHwJufMLX2HGjefsNHH4',
          },
        ],
      },
    },
  ],
});
