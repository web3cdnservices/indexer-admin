// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';
import { Hashicon } from '@emeraldpay/hashicon-react';
import { FC, useState, useCallback } from 'react';
import { useMutation } from '@apollo/client';
import { Button, Separator, Text } from '../../../components/primary';
import {
  createStartIndexingSteps,
  createReadyIndexingSteps,
  createStopIndexingSteps,
  modalTitles,
  createButtonItems,
} from '../constant';
import { startIndexing, stopIndexing, readyIndexing } from '../../../utils/indexerActions';
import { useIsIndexingStatusChanged } from '../../../hooks/indexerHook';
import { FormKey, IndexingStatus } from '../../projects/constant';
import { ActionType } from '../../../utils/transactions';
import { useSigner } from '../../../hooks/web3Hook';
import { useContractSDK } from '../../../containers/contractSdk';
import ModalView from '../../../components/modalView';
import { START_PROJECT, READY_PROJECT } from '../../../utils/queries';
import { useIndexingStatus } from '../../../hooks/projectHook';

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
};

const ProjectDetailsHeader: FC<Props> = ({ id }) => {
  // TODO: 1. only progress reach `100%` can display `publish to ready` button
  const name = 'Sushi Swap';

  // TODO: get `status` from contract

  const [visible, setVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [actionType, setActionType] = useState<ActionType | undefined>(undefined);

  const signer = useSigner();
  const sdk = useContractSDK();
  const status = useIndexingStatus(id, visible);
  const { request: checkIndexingStatusChanged, loading } = useIsIndexingStatusChanged(id);
  const [startIndexingRequest] = useMutation(START_PROJECT);
  const [indexingReadyRequest] = useMutation(READY_PROJECT);

  const onModalClose = (error?: Error) => {
    console.log('>>>action error:', error);
    setVisible(false);
    setCurrentStep(0);
  };

  const onButtonClick = (type: ActionType) => {
    setActionType(type);
    setVisible(true);
  };

  const buttonItems = createButtonItems(onButtonClick);
  const actionItems = buttonItems[status];

  const startIndexingSteps = createStartIndexingSteps(
    (_, values) => {
      const indexerEndpoint = values ? values[FormKey.START_PROJECT] : '';
      startIndexingRequest({ variables: { indexerEndpoint, id } })
        .then(() => setCurrentStep(1))
        .catch(onModalClose);
    },
    () => {
      startIndexing(sdk, signer, id)
        .then(() => {
          checkIndexingStatusChanged(IndexingStatus.INDEXING, onModalClose).catch(onModalClose);
        })
        .catch(onModalClose);
    }
  );

  const readyIndexingSteps = createReadyIndexingSteps(
    (_, values) => {
      const queryEndpoint = values ? values[FormKey.UPDATE_PROJECT_TO_READY] : '';
      indexingReadyRequest({ variables: { id, queryEndpoint } })
        .then(() => setCurrentStep(1))
        .catch(onModalClose);
    },
    () => {
      readyIndexing(sdk, signer, id)
        .then(() => {
          checkIndexingStatusChanged(IndexingStatus.READY, onModalClose).catch(onModalClose);
        })
        .catch(onModalClose);
    }
  );

  const stopIndexingSteps = createStopIndexingSteps(() => {
    stopIndexing(sdk, signer, id)
      .then(() => {
        checkIndexingStatusChanged(IndexingStatus.TERMINATED, onModalClose).catch(onModalClose);
      })
      .catch(onModalClose);
  });

  const steps = { ...startIndexingSteps, ...readyIndexingSteps, ...stopIndexingSteps };

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
        <Hashicon hasher="keccak" value={id} size={150} />
        <ContentContainer>
          <Text fw="600" size={30}>
            {name}
          </Text>
          <Text fw="400" size={15}>
            {id}
          </Text>
          <VersionContainer>
            <VersionItem versionType="INDEXED NETWORK" value="TESTNET" />
            <Separator height={50} />
            <VersionItem versionType="VERSION" value="V0.01" />
          </VersionContainer>
        </ContentContainer>
      </LeftContainer>
      {!!actionItems && (
        <ActionContainer>
          {actionItems.map(({ title, action, color }) => (
            <Button
              key={title}
              margin={10}
              width={200}
              title={title}
              color={color}
              onClick={action}
            />
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
