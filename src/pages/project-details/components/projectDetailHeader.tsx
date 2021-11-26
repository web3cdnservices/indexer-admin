// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';
import { Hashicon } from '@emeraldpay/hashicon-react';
import { useLocation } from 'react-router-dom';
import { FC, useState } from 'react';
import { useMutation } from '@apollo/client';
import { Button, Separator, Text } from '../../../components/primary';
import Modal from '../../../components/actionModal';
import {
  createStartIndexingSteps,
  createReadyIndexingSteps,
  createStopIndexingSteps,
  createButtonItem,
} from '../constant';
import { TProject } from '../types';
import { startIndexing, stopIndexing, readyIndexing } from '../../../utils/indexerActions';
import { useIsIndexingStatusChanged } from '../../../hooks/indexerHook';
import { IndexingStatus } from '../../projects/constant';
import { ActionType } from '../../../utils/transactions';
import { useSigner } from '../../../hooks/web3Hook';
import { useContractSDK } from '../../../containers/contractSdk';
import ModalView from '../../../components/modalView';
import { START_PROJECT, READY_PROJECT } from '../../../utils/queries';

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
  value: string;
};

const VersionItem: FC<VersionProps> = ({ versionType, value }) => (
  <VersionItemContainer>
    <Text size={15}>{versionType}</Text>
    <Text mt={5} color="gray" fw="400" size={13}>
      {value}
    </Text>
  </VersionItemContainer>
);

const ProjectDetailsHeader = () => {
  const location = useLocation();
  // @ts-ignore
  const { id, name, status }: TProject = location?.state;
  // TODO: 1. only progress reach `100%` can display `publish to ready` button

  const [visible, setVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [actionType, setActionType] = useState<ActionType | undefined>(undefined);

  const signer = useSigner();
  const sdk = useContractSDK();
  const { request: checkIndexingStatusChanged, loading } = useIsIndexingStatusChanged(id);
  const [startIndexingRequest] = useMutation(START_PROJECT);
  const [indexingReadyRequest] = useMutation(READY_PROJECT);

  const onModalClose = () => {
    setVisible(false);
    setCurrentStep(0);
  };

  const onButtonClick = (type: ActionType) => {
    setActionType(type);
    setVisible(true);
  };

  const buttonItems = {
    [IndexingStatus.NOTSTART]: [
      createButtonItem('Start Indexing', () => onButtonClick(ActionType.startIndexing)),
    ],
    [IndexingStatus.INDEXING]: [
      createButtonItem('Publish to Ready', () => onButtonClick(ActionType.readyIndexing)),
      createButtonItem('Stop Indexing', () => onButtonClick(ActionType.stopIndexing)),
    ],
    [IndexingStatus.READY]: [
      createButtonItem('Stop Indexing', () => onButtonClick(ActionType.stopIndexing)),
    ],
    [IndexingStatus.TERMINATED]: [],
  };

  const actionItems = buttonItems[status];

  // TODO: 2. change `id` to project owner address other than use deploymentID
  // TODO: 3. `stop indexing` button should be red color

  const startIndexingSteps = createStartIndexingSteps(
    () => {
      startIndexingRequest({
        variables: {
          id,
          indexerEndpoint: 'https://api.subquery.network/sq/AcalaNetwork/karura',
        },
      }).then(() => setCurrentStep(1));
    },
    () => {
      console.log('>>>id:', id);
      startIndexing(sdk, signer, id)
        .then(() => {
          checkIndexingStatusChanged(IndexingStatus.INDEXING, onModalClose).catch(onModalClose);
        })
        .catch(onModalClose);
    }
  );

  const readyIndexingSteps = createReadyIndexingSteps(
    () => {
      indexingReadyRequest({
        variables: {
          id,
          queryEndpoint: 'https://api.subquery.network/sq/AcalaNetwork/karura',
        },
      }).then(() => setCurrentStep(1));
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
            <VersionItem versionType="INDEXED NETWORK" value="Local Network" />
            <Separator height={50} />
            <VersionItem versionType="VERSION" value="V0.01" />
          </VersionContainer>
        </ContentContainer>
      </LeftContainer>
      {!!actionItems && (
        <ActionContainer>
          {actionItems.map(({ title, action, color }) => (
            <Button
              margin={10}
              key={title}
              width={200}
              title={title}
              color={color}
              onClick={action}
            />
          ))}
        </ActionContainer>
      )}
      <Modal
        visible={visible}
        // @ts-ignore
        title="Start Indexing Project"
        onClose={onModalClose}
      >
        <ModalView
          // @ts-ignore
          steps={actionType ? steps[actionType] : []}
          currentStep={currentStep}
          type={actionType}
          loading={loading}
        />
      </Modal>
    </Container>
  );
};

export default ProjectDetailsHeader;
