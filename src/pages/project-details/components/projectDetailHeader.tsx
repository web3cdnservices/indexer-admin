// Copyright 2020-2022 SubQuery Pte Ltd authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { FC, useMemo, useState } from 'react';
import { useMutation } from '@apollo/client';
import { FormikHelpers, FormikValues } from 'formik';
import { isUndefined } from 'lodash';
import styled from 'styled-components';

import Avatar from 'components/avatar';
import ModalView from 'components/modalView';
import { Button, Separator, Text } from 'components/primary';
import { TagItem } from 'components/tagItem';
import { ProjectDetails } from 'hooks/projectHook';
import { useIndexingAction } from 'hooks/transactionHook';
import { IndexingStatus } from 'pages/projects/constant';
import { ProjectFormKey } from 'types/schemas';
import { cidToBytes32 } from 'utils/ipfs';
import { ServiceStatus } from 'utils/project';
import { START_PROJECT, STOP_PROJECT } from 'utils/queries';
import { ProjectAction } from 'utils/transactions';

import {
  createAnnounceIndexingSteps,
  createButtonItems,
  createNotIndexingSteps,
  createReadyIndexingSteps,
  createRestartProjectSteps,
  createStartIndexingSteps,
  createStopIndexingSteps,
  createStopProjectSteps,
  modalTitles,
  ProjectStatus,
} from '../config';
import { TService } from '../types';

type Props = {
  id: string;
  status: IndexingStatus;
  project: ProjectDetails;
  service?: TService;
  stateChanged: () => void;
};

const ProjectDetailsHeader: FC<Props> = ({ id, status, project, service, stateChanged }) => {
  // TODO: 1. only progress reach `100%` can display `publish to ready` button

  const [visible, setVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [actionType, setActionType] = useState<ProjectAction>();

  const indexingAction = useIndexingAction(id);
  const [startProjectRequest, { loading: startProjectLoading }] = useMutation(START_PROJECT);
  const [stopProjectRequest, { loading: stopProjectLoading }] = useMutation(STOP_PROJECT);

  const onModalClose = () => {
    setVisible(false);
    setCurrentStep(0);
  };

  const loading = useMemo(
    () => startProjectLoading || stopProjectLoading,
    [startProjectLoading, stopProjectLoading]
  );

  const projectStatus = useMemo(() => {
    switch (status) {
      case IndexingStatus.NOTINDEXING:
        return service?.status === ServiceStatus.healthy
          ? ProjectStatus.Started
          : ProjectStatus.NotIndexing;
      case IndexingStatus.INDEXING:
        return service?.status === ServiceStatus.healthy
          ? ProjectStatus.Indexing
          : ProjectStatus.Terminated;
      case IndexingStatus.READY:
        return service?.status === ServiceStatus.healthy
          ? ProjectStatus.Ready
          : ProjectStatus.Terminated;
      default:
        return ProjectStatus.NotIndexing;
    }
  }, [status, service]);

  const buttonItems = createButtonItems((type: ProjectAction) => {
    setActionType(type);
    setVisible(true);
  });

  const actionItems = useMemo(() => {
    if (isUndefined(projectStatus)) return [];
    return buttonItems[projectStatus];
  }, [projectStatus]);

  const updateState = (deplay = 3000) => {
    setTimeout(() => {
      stateChanged();
    }, deplay);
  };

  const startProject = async (values: FormikValues, formHelper: FormikHelpers<FormikValues>) => {
    const networkEndpoint = values[ProjectFormKey.networkEndpoint];
    try {
      await startProjectRequest({ variables: { networkEndpoint, id } });
      updateState();
      setCurrentStep(1);
    } catch (e) {
      formHelper.setErrors({ [ProjectFormKey.networkEndpoint]: 'Invalid service endpoint' });
    }
  };

  const stopProject = async () => {
    try {
      await stopProjectRequest({ variables: { id } });
      updateState();
      setCurrentStep(1);
    } catch (e) {
      console.log('fail to stop project', e);
    }
  };

  const startIndexingSteps = createStartIndexingSteps(startProject);
  const stopIndexingSteps = createStopIndexingSteps(stopProject, () =>
    indexingAction(ProjectAction.AnnounceNotIndexing, onModalClose)
  );
  const restartProjectSteps = createRestartProjectSteps(startProject);
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
    return [modalTitles[actionType], steps[actionType]];
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
            <TagItem versionType="VERSION" value={`V${project.version}`} />
          </VersionContainer>
        </ContentContainer>
      </LeftContainer>
      {!!actionItems && (
        <ActionContainer>
          {actionItems.map(({ title, action }) => (
            <Button mt={10} key={title} width={230} title={title} onClick={action} />
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
  width: 300px;
`;

const ActionContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
