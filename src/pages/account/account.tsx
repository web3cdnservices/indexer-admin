// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useState } from 'react';

import { useHistory } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import {
  useController,
  useIsController,
  useIsControllerChanged,
  useIsIndexer,
  useIsIndexerChanged,
} from '../../hooks/indexerHook';
import { useIsMetaMask, useSigner, useWeb3 } from '../../hooks/web3Hook';
import { Container } from './styles';
import prompts from './prompts';
import AccountCard from '../../components/accountCard';
import MetaMaskView from '../login/metamaskView';
import Modal from '../../components/actionModal';
import { ActionType } from '../../utils/transactions';
import ModalView from '../../components/modalView';
import { createSteps } from './constant';
import { UPDAET_CONTROLLER } from '../../utils/queries';
import { configController } from '../../utils/indexerActions';
import { useContractSDK } from '../../containers/contractSdk';

const Registry = () => {
  const [visible, setVisible] = useState(false);
  const [timestamp, setTimestamp] = useState(Date.now());
  const [currentStep, setCurrentStep] = useState(0);
  const [updatedC, setUpdatedC] = useState('');

  const { account } = useWeb3();
  const signer = useSigner();
  const sdk = useContractSDK();
  const history = useHistory();
  const isMetaMask = useIsMetaMask();
  const isIndexer = useIsIndexer();
  const isController = useIsController(account);
  const controller = useController(account, timestamp);
  const [updateController, { loading: updateControllerLoading }] = useMutation(UPDAET_CONTROLLER);

  const { request: checkIsIndexerChanged, loading: indexerLoading } = useIsIndexerChanged();
  const { request: checkIsControllerChanged, loading: controllerLoading } =
    useIsControllerChanged(account);

  // TODO: `desc` should be a real time string other than fixed one
  const controllerItem = !controller ? prompts.emptyController : prompts.controller;
  const { indexer } = prompts;

  const onModalClose = () => {
    setVisible(false);
    setCurrentStep(0);
  };

  const stepsConfig = createSteps(
    (_, values) => {
      // const privateKey = values ? values[FormKey.CONFIG_CONTROLLER] : '';
      // FIXME: fix hard code
      const privateKey = '0x8075991ce870b93a8870eca0c0f91913d12f47948ca0fd25b49c6fa7cdbeee8b';
      setUpdatedC('0x3Cd0A705a2DC65e5b1E1205896BaA2be8A07c6e0');
      updateController({ variables: { controller: privateKey } }).then(() => {
        setCurrentStep(1);
      });
    },
    () => {
      configController(sdk, signer, updatedC)
        .then(() => {
          checkIsControllerChanged(updatedC, () => {
            setTimestamp(Date.now());
            onModalClose();
          }).catch((e) => console.log('error:', e));
        })
        .catch((errorMsg) => {
          console.log('error:', errorMsg);
          onModalClose();
        });
    }
  );

  // TODO: display empty view if the current account is invalid

  return (
    <Container>
      {isMetaMask && isIndexer && (
        <AccountCard
          title={indexer.title}
          name={indexer.name}
          buttonTitle={indexer.buttonTitle}
          account={account ?? ''}
          status="active"
          desc={indexer.desc}
          loading={indexerLoading}
          onClick={() => {
            setVisible(true);
            // FIXME: should call when sending the transaction
            // checkIsIndexerChanged(false, () => history.replace('./'));
          }}
        />
      )}
      {(isIndexer || isController) && (
        <AccountCard
          title={controllerItem.title}
          name={controllerItem.name}
          account={controller}
          buttonTitle={isIndexer ? controllerItem.buttonTitle : ''}
          desc={controllerItem.desc}
          onClick={() => {
            setVisible(true);
            // FIXME: should call and get the target controller address when sending the transaction
            checkIsControllerChanged('0x3Cd0A705a2DC65e5b1E1205896BaA2be8A07c6e0', () =>
              setTimestamp(Date.now())
            );
          }}
        />
      )}
      {!isMetaMask && <MetaMaskView />}
      <Modal visible={visible} title="Config Controller" onClose={onModalClose}>
        <ModalView
          steps={stepsConfig[ActionType.configCntroller]}
          currentStep={currentStep}
          type={ActionType.configCntroller}
          loading={updateControllerLoading || controllerLoading}
        />
      </Modal>
    </Container>
  );
};

export default Registry;
