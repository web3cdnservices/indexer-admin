// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { FC, useCallback, useMemo, useState } from 'react';
import { useMutation } from '@apollo/client';
import styled from 'styled-components';

import Avatar from 'components/avatar';
import ModalView from 'components/modalView';
import { Button, Separator, Text } from 'components/primary';
import { useContractSDK } from 'containers/contractSdk';
import { useToast } from 'containers/toastContext';
import { ProjectDetails, useIndexingStatus } from 'hooks/projectHook';
import { useSigner } from 'hooks/web3Hook';
import { IndexingStatus } from 'pages/projects/constant';
import { ProjectFormKey } from 'types/schemas';
import { readyIndexing, startIndexing, stopIndexing } from 'utils/indexerActions';
import { cidToBytes32 } from 'utils/ipfs';
import { CONFIG_SERVICES } from 'utils/queries';
import { ActionType, handleTransaction } from 'utils/transactions';
import { verifyQueryService } from 'utils/validateService';

import {
  createButtonItems,
  createConfigServicesSteps,
  createReadyIndexingSteps,
  createStartIndexingSteps,
  createStopIndexingSteps,
  modalTitles,
} from '../config';

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

const VersionItemContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`;

const ActionContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

type VersionProps = {
  versionType: string;
  value?: string;
};

const VersionItem: FC<VersionProps> = ({ versionType, value }) => (
  <VersionItemContainer>
    <Text size={15}>{versionType}</Text>
    <Text mt={5} color="gray" fw="400" size={13}>
      {value ?? ''}
    </Text>
  </VersionItemContainer>
);

type Props = {
  id: string;
  project: ProjectDetails;
  serviceConfiged: boolean;
};

const ProjectDetailsHeader: FC<Props> = ({ id, project, serviceConfiged }) => {
  // TODO: 1. only progress reach `100%` can display `publish to ready` button
  // TODO: get `status` from contract

  const [visible, setVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [actionType, setActionType] = useState<ActionType>();

  const signer = useSigner();
  const sdk = useContractSDK();
  const toastContext = useToast();
  const status = useIndexingStatus(id, toastContext.toast?.type);
  const [updateServices, { loading }] = useMutation(CONFIG_SERVICES);

  const onModalClose = (e?: unknown) => {
    console.error('Transaction error:', e);
    setVisible(false);
    setCurrentStep(0);
  };

  const actionItems = useMemo(() => {
    const buttonItems = createButtonItems((type: ActionType) => {
      setActionType(type);
      setVisible(true);
    });

    if (status === IndexingStatus.NOTSTART && !serviceConfiged) {
      return [buttonItems[status][0]];
    }

    return buttonItems[status];
  }, [status, serviceConfiged]);

  const configServicesSteps = createConfigServicesSteps(async (values, formHelper) => {
    try {
      const indexerEndpoint = values[ProjectFormKey.indexerEndpoint];
      const queryEndpoint = values[ProjectFormKey.queryEndpoint];
      await verifyQueryService(queryEndpoint);
      await updateServices({ variables: { queryEndpoint, indexerEndpoint, id } });
    } catch (e) {
      console.log('>>>e:', e);
      formHelper.setErrors({ [ProjectFormKey.queryEndpoint]: 'Invalid query endpoint' });
    }
  });

  const indexingTransactions = useMemo(
    () => ({
      [ActionType.startIndexing]: () => startIndexing(sdk, signer, id),
      [ActionType.readyIndexing]: () => readyIndexing(sdk, signer, id),
      [ActionType.stopIndexing]: () => stopIndexing(sdk, signer, id),
    }),
    [sdk, signer, id]
  );

  const indexingAction = async (
    type: ActionType.startIndexing | ActionType.readyIndexing | ActionType.stopIndexing
  ) => {
    try {
      const tx = await indexingTransactions[type]();
      onModalClose();
      await handleTransaction(tx, toastContext);
    } catch (e) {
      onModalClose(e);
    }
  };

  const startIndexingSteps = createStartIndexingSteps(() =>
    indexingAction(ActionType.startIndexing)
  );

  const readyIndexingSteps = createReadyIndexingSteps(() =>
    indexingAction(ActionType.readyIndexing)
  );

  const stopIndexingSteps = createStopIndexingSteps(() => indexingAction(ActionType.stopIndexing));

  const steps = {
    ...configServicesSteps,
    ...startIndexingSteps,
    ...readyIndexingSteps,
    ...stopIndexingSteps,
  };

  // FIXME: these ts-ignore
  const getModalTitle = useCallback(() => {
    // @ts-ignore
    return actionType ? modalTitles[actionType] : '';
  }, [actionType]);

  const getModalSteps = useCallback(() => {
    // @ts-ignore
    return actionType ? steps[actionType] : [];
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
            <VersionItem versionType="INDEXED NETWORK" value="TESTNET" />
            <Separator height={50} />
            <VersionItem versionType="VERSION" value={`V${project.version}`} />
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
        title={getModalTitle()}
        onClose={() => onModalClose()}
        steps={getModalSteps()}
        currentStep={currentStep}
        type={actionType}
        loading={loading}
      />
    </Container>
  );
};

export default ProjectDetailsHeader;
