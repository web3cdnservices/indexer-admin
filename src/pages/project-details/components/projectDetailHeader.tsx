// Copyright 2020-2022 SubQuery Pte Ltd authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { FC, useMemo, useState } from 'react';
import { useMutation } from '@apollo/client';
import { FormikHelpers, FormikValues } from 'formik';
import { isUndefined } from 'lodash';
import styled from 'styled-components';

import AlertView from 'components/alertView';
import Avatar from 'components/avatar';
import ModalView from 'components/modalView';
import { Button, Separator, Text } from 'components/primary';
import { TagItem } from 'components/tagItem';
import { useNotification } from 'containers/notificationContext';
import { ProjectDetails, useProjectService } from 'hooks/projectHook';
import { useIndexingAction } from 'hooks/transactionHook';
import { ProjectFormKey } from 'types/schemas';
import { cidToBytes32 } from 'utils/ipfs';
import { ProjectNotification } from 'utils/notification';
import { START_PROJECT, STOP_PROJECT } from 'utils/queries';
import { txErrorNotification } from 'utils/transactions';

import {
  aletMessages,
  createAnnounceIndexingSteps,
  createButtonItems,
  createNotIndexingSteps,
  createReadyIndexingSteps,
  createRestartProjectSteps,
  createStartIndexingSteps,
  createStopIndexingSteps,
  createStopProjectSteps,
  notifications,
  ProjectActionName,
} from '../config';
import { IndexingStatus, ProjectAction, ProjectStatus, TQueryMetadata } from '../types';

type Props = {
  id: string;
  project: ProjectDetails;
  status?: IndexingStatus;
  metadata?: TQueryMetadata;
  stateChanged: () => void;
};

const ProjectDetailsHeader: FC<Props> = ({ id, status, project, metadata, stateChanged }) => {
  const [visible, setVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [actionType, setActionType] = useState<ProjectAction>();

  const indexingAction = useIndexingAction(id);
  const projectService = useProjectService(id);
  const { dispatchNotification } = useNotification();
  const [startProjectRequest, { loading: startProjectLoading }] = useMutation(START_PROJECT);
  const [stopProjectRequest, { loading: stopProjectLoading }] = useMutation(STOP_PROJECT);

  const onModalClose = (error?: any) => {
    setVisible(false);
    setCurrentStep(0);

    if (error?.data?.message) {
      dispatchNotification(txErrorNotification(error.data.message));
    }
  };

  const loading = useMemo(
    () => startProjectLoading || stopProjectLoading,
    [startProjectLoading, stopProjectLoading]
  );

  const projectStatus = useMemo(() => {
    const healthy = metadata?.indexerStatus === 'HEALTHY';
    switch (status) {
      case IndexingStatus.NOTINDEXING:
        return healthy ? ProjectStatus.Started : ProjectStatus.NotIndexing;
      case IndexingStatus.INDEXING:
        return healthy ? ProjectStatus.Indexing : ProjectStatus.Terminated;
      case IndexingStatus.READY:
        return healthy ? ProjectStatus.Ready : ProjectStatus.Terminated;
      default:
        return ProjectStatus.NotIndexing;
    }
  }, [status, metadata]);

  const alertInfo = useMemo(
    () =>
      projectStatus === ProjectStatus.Terminated
        ? { visible: true, ...aletMessages[projectStatus] }
        : { visible: false },
    [projectStatus]
  );

  const buttonItems = createButtonItems((type: ProjectAction) => {
    setActionType(type);
    setVisible(true);
  });

  const actionItems = useMemo(() => {
    if (isUndefined(projectStatus)) return [];
    return buttonItems[projectStatus];
  }, [projectStatus]);

  const projectConfig = useMemo(
    () => ({
      networkEndpoint: projectService?.networkEndpoint ?? '',
      networkDictionary: projectService?.networkDictionary ?? '',
      nodeVersion: projectService?.nodeVersion ?? '',
      queryVersion: projectService?.queryVersion ?? '',
      poiEnabled: projectService?.poiEnabled ?? false,
    }),
    [projectService]
  );

  const projectStateChange = (
    type: ProjectNotification.Started | ProjectNotification.Terminated
  ) => {
    stateChanged();
    const notification = notifications[type];
    dispatchNotification(notification);
  };

  const startProject = async (values: FormikValues, formHelper: FormikHelpers<FormikValues>) => {
    try {
      console.log('values:', values);
      const poiEnabled = values.poiEnabled === 'true';
      await startProjectRequest({ variables: { ...values, poiEnabled, id } });
      onModalClose();
      projectStateChange(ProjectNotification.Started);
    } catch (e) {
      formHelper.setErrors({ [ProjectFormKey.networkEndpoint]: 'Invalid service endpoint' });
    }
  };

  const stopProject = async () => {
    try {
      await stopProjectRequest({ variables: { id } });
      projectStateChange(ProjectNotification.Terminated);
      setCurrentStep(1);
    } catch (e) {
      console.log('fail to stop project', e);
    }
  };

  const startIndexingSteps = createStartIndexingSteps(projectConfig, startProject);
  const stopIndexingSteps = createStopIndexingSteps(stopProject, () =>
    indexingAction(ProjectAction.AnnounceNotIndexing, onModalClose)
  );
  const restartProjectSteps = createRestartProjectSteps(projectConfig, startProject);
  const stopProjectSteps = createStopProjectSteps(stopProject);
  const announceIndexingSteps = createAnnounceIndexingSteps(() =>
    indexingAction(ProjectAction.AnnounceIndexing, onModalClose)
  );
  const announceReadySteps = createReadyIndexingSteps(() =>
    indexingAction(ProjectAction.AnnounceReady, onModalClose)
  );
  const announceNotIndexingSteps = createNotIndexingSteps(() =>
    indexingAction(ProjectAction.AnnounceNotIndexing, onModalClose)
  );

  const steps = {
    ...startIndexingSteps,
    ...restartProjectSteps,
    ...stopIndexingSteps,
    ...stopProjectSteps,
    ...announceIndexingSteps,
    ...announceReadySteps,
    ...announceNotIndexingSteps,
  };

  const [modalTitle, modalSteps] = useMemo(() => {
    if (!actionType) return ['', []];
    return [ProjectActionName[actionType], steps[actionType]];
  }, [actionType]);

  return (
    <Container>
      <LeftContainer>
        <Avatar address={cidToBytes32(id)} size={100} />
        <ContentContainer>
          <Text fw="600" size={30}>
            {project.name}
          </Text>
          <Text fw="400" size={15}>
            {project.owner}
          </Text>
          <VersionContainer>
            <TagItem versionType="INDEXED NETWORK" value={project.metadata?.chain} />
            <Separator height={50} />
            <TagItem versionType="VERSION" value={`V${project.version ?? '1.0.0'}`} />
            <Separator height={50} />
            <TagItem versionType="PROJECT STATUS" value={projectStatus} />
          </VersionContainer>
        </ContentContainer>
      </LeftContainer>
      {!isUndefined(status) && !!actionItems && (
        <ActionContainer>
          {actionItems.map(({ title, action }) => (
            <Button mt={10} key={title} width={265} title={title} onClick={action} />
          ))}
        </ActionContainer>
      )}
      <ModalView
        visible={visible}
        title={modalTitle}
        onClose={onModalClose}
        // @ts-ignore
        steps={modalSteps}
        currentStep={currentStep}
        type={actionType}
        loading={loading}
      />
      <AlertView {...alertInfo} />
    </Container>
  );
};

export default ProjectDetailsHeader;

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  min-height: 200px;
`;

const LeftContainer = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  min-width: 685px;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  margin-left: 40px;
`;

const VersionContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 25px;
  height: 50px;
  width: 500px;
`;

const ActionContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
