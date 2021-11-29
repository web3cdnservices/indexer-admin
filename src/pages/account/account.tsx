// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { isValidPrivate, toBuffer, privateToAddress, bufferToHex } from 'ethereumjs-util';
import {
  useBalance,
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
import { ActionType } from '../../utils/transactions';
import ModalView from '../../components/modalView';
import { createControllerSteps, createUnregisterSteps, modalTitles } from './config';
import { UPDAET_CONTROLLER } from '../../utils/queries';
import { configController, unRegister } from '../../utils/indexerActions';
import { useContractSDK } from '../../containers/contractSdk';
import { FormKey } from '../projects/constant';

const Registry = () => {
  const [visible, setVisible] = useState(false);
  const [timestamp, setTimestamp] = useState(Date.now());
  const [currentStep, setCurrentStep] = useState(0);
  const [inputController, setController] = useState('');
  const [actionType, setActionType] = useState<ActionType | undefined>(undefined);

  const { account } = useWeb3();
  const signer = useSigner();
  const sdk = useContractSDK();
  const history = useHistory();
  const isMetaMask = useIsMetaMask();
  const isIndexer = useIsIndexer();
  const isController = useIsController(account);
  const controller = useController(account, timestamp);
  const controllerBalance = useBalance(controller);
  const indexerBalance = useBalance(account);
  const [updateController, { loading: updateControllerLoading }] = useMutation(UPDAET_CONTROLLER);
  const { request: checkIsIndexerChanged, loading: indexerLoading } = useIsIndexerChanged();
  const { request: checkIsControllerChanged, loading: controllerLoading } =
    useIsControllerChanged(account);

  prompts.controller.desc = `Balance ${controllerBalance} SQT`;
  const controllerItem = !controller ? prompts.emptyController : prompts.controller;
  const indexerItem = prompts.indexer;

  const onModalShow = (type: ActionType) => {
    setActionType(type);
    setVisible(true);
  };

  const onModalClose = () => {
    setVisible(false);
    setCurrentStep(0);
  };

  const controllerStepsConfig = createControllerSteps(
    (_, values) => {
      // FIXME: use this for validation
      const privateKey = values ? values[FormKey.CONFIG_CONTROLLER] : '';
      if (!privateKey || !privateKey.startsWith('0x') || !isValidPrivate(toBuffer(privateKey)))
        return;

      // TODO: validation for the input private key.
      // 1.check private key valid - done
      // 2. check controller already been used through `indexerRegister`

      setController(bufferToHex(privateToAddress(toBuffer(privateKey))));
      updateController({ variables: { controller: privateKey } }).then(() => {
        setCurrentStep(1);
      });
    },
    () => {
      configController(sdk, signer, inputController)
        .then(() => {
          checkIsControllerChanged(inputController, () => {
            setTimestamp(Date.now());
            onModalClose();
          }).catch((e) => console.log('error:', e));
        })
        .catch(onModalClose);
    }
  );

  const unregisterStepConfig = createUnregisterSteps(() => {
    unRegister(sdk, signer)
      .then(() => {
        checkIsIndexerChanged(false, () => {
          onModalClose();
          history.replace('./');
        }).catch((e) => console.log('error:', e));
      })
      .catch(onModalClose);
  });

  const steps = { ...controllerStepsConfig, ...unregisterStepConfig };

  // TODO: display empty view if the current account is invalid

  return (
    <Container>
      {isMetaMask && isIndexer && (
        <AccountCard
          title={indexerItem.title}
          name={indexerItem.name}
          buttonTitle={indexerItem.buttonTitle}
          type={ActionType.unregister}
          account={account ?? ''}
          status="active"
          desc={`Balance: ${indexerBalance} SQT`}
          loading={indexerLoading}
          onClick={onModalShow}
        />
      )}
      {(isIndexer || isController) && (
        <AccountCard
          title={controllerItem.title}
          name={controllerItem.name}
          type={ActionType.configCntroller}
          account={controller}
          buttonTitle={isIndexer ? controllerItem.buttonTitle : ''}
          desc={controllerItem?.desc}
          onClick={onModalShow}
        />
      )}
      {!isMetaMask && <MetaMaskView />}
      <ModalView
        visible={visible}
        // @ts-ignore
        title={actionType ? modalTitles[actionType] : ''}
        onClose={onModalClose}
        // @ts-ignore
        steps={actionType ? steps[actionType] : []}
        currentStep={currentStep}
        type={actionType}
        loading={updateControllerLoading || indexerLoading || controllerLoading}
      />
    </Container>
  );
};

export default Registry;
