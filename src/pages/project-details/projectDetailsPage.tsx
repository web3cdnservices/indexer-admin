// Copyright 2020-2022 SubQuery Pte Ltd authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useEffect, useMemo, useState } from 'react';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { FormikHelpers, FormikValues } from 'formik';
import { isUndefined } from 'lodash';

import AlertView from 'components/alertView';
import ModalView from 'components/modalView';
import { useLoading } from 'containers/loadingContext';
import { useNotification } from 'containers/notificationContext';
import {
  getQueryMetadata,
  ProjectDetails,
  useIndexingStatus,
  useNodeVersions,
  useProjectDetails,
  useProjectService,
  useQueryVersions,
} from 'hooks/projectHook';
import { useRouter } from 'hooks/routerHook';
import { useIndexingAction } from 'hooks/transactionHook';
import { ProjectFormKey } from 'types/schemas';
import { ProjectNotification } from 'utils/notification';
import { calculateProgress } from 'utils/project';
import { REMOVE_PROJECT, START_PROJECT, STOP_PROJECT } from 'utils/queries';
import { txErrorNotification } from 'utils/transactions';

import ProjectDetailsHeader from './components/projectDetailHeader';
import ProjectServiceCard from './components/projectServiceCard';
import ProjectStatusView from './components/projectStatusView';
import ProjectTabbarView from './components/projectTabBarView';
import {
  aletMessages,
  createAnnounceIndexingSteps,
  createNetworkButtonItems,
  createNotIndexingSteps,
  createReadyIndexingSteps,
  createRemoveProjectSteps,
  createRestartProjectSteps,
  createServiceButtonItems,
  createStartIndexingSteps,
  createStopIndexingSteps,
  createStopProjectSteps,
  notifications,
  ProjectActionName,
} from './config';
import { Container, ContentContainer } from './styles';
import { IndexingStatus, ProjectAction, ProjectStatus, TQueryMetadata } from './types';

const ProjectDetailsPage = () => {
  const { id } = useParams() as { id: string };
  const { data: projectDetails } = useLocation().state as { data: ProjectDetails };

  const status = useIndexingStatus(id);
  const projectInfo = useProjectDetails(id);
  const { setPageLoading } = useLoading();
  const history = useHistory();
  useRouter(!projectDetails);

  const indexingAction = useIndexingAction(id);
  const projectService = useProjectService(id);
  const { dispatchNotification } = useNotification();
  const [startProjectRequest, { loading: startProjectLoading }] = useMutation(START_PROJECT);
  const [stopProjectRequest, { loading: stopProjectLoading }] = useMutation(STOP_PROJECT);
  const [removeProjectRequest, { loading: removeProjectLoading }] = useMutation(REMOVE_PROJECT);
  const queryVersions = useQueryVersions(id);
  const nodeVersions = useNodeVersions(id);

  const [progress, setProgress] = useState(0);
  const [metadata, setMetadata] = useState<TQueryMetadata>();
  const [visible, setVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [actionType, setActionType] = useState<ProjectAction>();

  const fetchQueryMetadata = async () => {
    const data = await getQueryMetadata(id);
    setProgress(calculateProgress(data.targetHeight, data.lastProcessedHeight));
    setMetadata(data);
  };

  const updateServiceStatus = () => {
    const intervalId = setInterval(() => fetchQueryMetadata(), 2000);
    setTimeout(() => clearInterval(intervalId), 15000);
  };

  useEffect(() => {
    setPageLoading(isUndefined(projectInfo));
  }, [projectInfo]);

  useEffect(() => {
    fetchQueryMetadata();
  }, [status]);

  const loading = useMemo(
    () => startProjectLoading || stopProjectLoading || removeProjectLoading,
    [startProjectLoading, stopProjectLoading, removeProjectLoading]
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

  const networkBtnItems = createNetworkButtonItems((type: ProjectAction) => {
    setActionType(type);
    setVisible(true);
  });

  const serviceBtnItems = createServiceButtonItems((type: ProjectAction) => {
    setActionType(type);
    setVisible(true);
  });

  const networkActionItems = useMemo(() => {
    if (isUndefined(projectStatus)) return [];
    return networkBtnItems[projectStatus];
  }, [projectStatus]);

  const serviceActionItems = useMemo(() => {
    if (isUndefined(projectStatus)) return [];
    return serviceBtnItems[projectStatus];
  }, [projectStatus]);

  const onModalClose = (error?: any) => {
    setVisible(false);
    setCurrentStep(0);

    if (error?.data?.message) {
      dispatchNotification(txErrorNotification(error.data.message));
    }
  };

  const projectConfig = useMemo(
    () => ({
      networkEndpoint: projectService?.networkEndpoint ?? '',
      networkDictionary: projectService?.networkDictionary ?? '',
      nodeVersion: projectService?.nodeVersion ? projectService.nodeVersion : nodeVersions[0],
      queryVersion: projectService?.queryVersion ? projectService.queryVersion : queryVersions[0],
      poiEnabled: projectService?.poiEnabled ?? false,
    }),
    [projectService, nodeVersions, queryVersions]
  );

  const imageVersions = useMemo(
    () => ({ query: queryVersions, node: nodeVersions }),
    [nodeVersions, queryVersions]
  );

  const projectStateChange = (
    type: ProjectNotification.Started | ProjectNotification.Terminated
  ) => {
    const notification = notifications[type];
    dispatchNotification(notification);
    updateServiceStatus();
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

  const removeProject = async () => {
    try {
      await removeProjectRequest({ variables: { id } });
      history.replace('/projects');
    } catch (e) {
      console.log('fail to remove project', e);
    }
  };

  const startIndexingSteps = createStartIndexingSteps(projectConfig, imageVersions, startProject);
  const restartProjectSteps = createRestartProjectSteps(projectConfig, imageVersions, startProject);
  const stopIndexingSteps = createStopIndexingSteps(stopProject, () =>
    indexingAction(ProjectAction.AnnounceNotIndexing, onModalClose)
  );

  const stopProjectSteps = createStopProjectSteps(stopProject);
  const removeProjectSteps = createRemoveProjectSteps(removeProject);
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
    ...removeProjectSteps,
    ...announceIndexingSteps,
    ...announceReadySteps,
    ...announceNotIndexingSteps,
  };

  const [modalTitle, modalSteps] = useMemo(() => {
    if (!actionType) return ['', []];
    return [ProjectActionName[actionType], steps[actionType]];
  }, [actionType, steps]);

  return (
    <Container>
      {projectInfo && (
        <ContentContainer>
          <ProjectDetailsHeader id={id} projectStatus={projectStatus} project={projectInfo} />
          <ProjectStatusView
            percent={progress}
            actionItems={networkActionItems}
            status={status}
            metadata={metadata}
          />
          <ProjectServiceCard id={id} actionItems={serviceActionItems} data={metadata} />
          <ProjectTabbarView id={id} project={projectInfo} />
        </ContentContainer>
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

export default ProjectDetailsPage;
