// Copyright 2020-2022 SubQuery Pte Ltd authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useEffect, useMemo, useState } from 'react';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { FormikHelpers, FormikValues } from 'formik';
import { isUndefined } from 'lodash';

import AlertView from 'components/alertView';
import { PopupView } from 'components/popupView';
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
import { calculateProgress, isTrue } from 'utils/project';
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
  const { projectService, getProjectService } = useProjectService(id);
  // const paygStatus = projectService?.paygPrice ? PaygStatus.Open : PaygStatus.Close;
  const { dispatchNotification } = useNotification();
  const [startProjectRequest, { loading: startProjectLoading }] = useMutation(START_PROJECT);
  const [stopProjectRequest, { loading: stopProjectLoading }] = useMutation(STOP_PROJECT);
  const [removeProjectRequest, { loading: removeProjectLoading }] = useMutation(REMOVE_PROJECT);
  const queryVersions = useQueryVersions(id);
  const nodeVersions = useNodeVersions(id);

  const [progress, setProgress] = useState(0);
  const [metadata, setMetadata] = useState<TQueryMetadata>();
  const [visible, setVisible] = useState(false);

  const [actionType, setActionType] = useState<ProjectAction>();

  const fetchQueryMetadata = async () => {
    const data = await getQueryMetadata(id);
    setMetadata(data);
  };

  const updateServiceStatus = () => {
    const intervalId = setInterval(() => fetchQueryMetadata(), 6000);
    setTimeout(() => {
      clearInterval(intervalId);
      getProjectService();
    }, 60000);
  };

  useEffect(() => {
    setPageLoading(isUndefined(projectInfo));
  }, [projectInfo]);

  useEffect(() => {
    metadata && setProgress(calculateProgress(metadata.targetHeight, metadata.lastProcessedHeight));
  }, [metadata]);

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

  const onPopoverClose = (error?: any) => {
    setVisible(false);
    if (error?.data?.message) {
      dispatchNotification(txErrorNotification(error.data.message));
    }
  };

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
      const { purgeDB } = values;
      await startProjectRequest({
        variables: {
          ...values,
          purgeDB: isTrue(purgeDB),
          id,
        },
      });

      onPopoverClose();
      projectStateChange(ProjectNotification.Started);
    } catch (e) {
      formHelper.setErrors({ [ProjectFormKey.networkEndpoint]: 'Invalid service endpoint' });
    }
  };

  const stopProject = async () => {
    try {
      await stopProjectRequest({ variables: { id } });
      onPopoverClose();
      projectStateChange(ProjectNotification.Terminated);
    } catch (e) {
      console.error('fail to stop project', e);
    }
  };

  const removeProject = async () => {
    try {
      await removeProjectRequest({ variables: { id } });
      history.replace('/projects');
    } catch (e) {
      console.error('fail to remove project', e);
    }
  };

  const steps = useMemo(() => {
    const startIndexingSteps = createStartIndexingSteps(
      projectService,
      imageVersions,
      startProject
    );
    const restartProjectSteps = createRestartProjectSteps(
      projectService,
      imageVersions,
      startProject
    );
    const stopIndexingSteps = createStopIndexingSteps(stopProject);

    const stopProjectSteps = createStopProjectSteps(stopProject);
    const removeProjectSteps = createRemoveProjectSteps(removeProject);
    const announceIndexingSteps = createAnnounceIndexingSteps(() =>
      indexingAction(ProjectAction.AnnounceIndexing, onPopoverClose)
    );
    const announceReadySteps = createReadyIndexingSteps(() =>
      indexingAction(ProjectAction.AnnounceReady, onPopoverClose)
    );
    const announceNotIndexingSteps = createNotIndexingSteps(() =>
      indexingAction(ProjectAction.AnnounceNotIndexing, onPopoverClose)
    );

    return {
      ...startIndexingSteps,
      ...restartProjectSteps,
      ...stopIndexingSteps,
      ...stopProjectSteps,
      ...removeProjectSteps,
      ...announceIndexingSteps,
      ...announceReadySteps,
      ...announceNotIndexingSteps,
    };
  }, [projectService, imageVersions, startProject, stopProject, removeProject]);

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
          <ProjectTabbarView id={id} project={projectInfo} config={projectService} />
        </ContentContainer>
      )}
      <PopupView
        setVisible={setVisible}
        visible={visible}
        title={modalTitle}
        onClose={onPopoverClose}
        // @ts-ignore
        steps={modalSteps}
        type={actionType}
        loading={loading}
      />
      <AlertView {...alertInfo} />
    </Container>
  );
};

export default ProjectDetailsPage;
