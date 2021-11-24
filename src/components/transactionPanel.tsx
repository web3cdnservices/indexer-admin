// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import styled from '@emotion/styled';
import Button from '@mui/material/Button';
import { FC, useState } from 'react';
import { useContractSDK } from '../containers/contractSdk';
import { useSigner } from '../hooks/web3Hook';
import { configController, startIndexing, stopIndexing, unRegister } from '../utils/indexerActions';
import { TransactionType, transactionSchema, TransactionKey } from '../utils/transactions';
import InputField from './inputField';
import Alert from './alert';

const Container = styled.div<{ display: boolean }>`
  position: absolute;
  top: 150px;
  right: 0px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  min-height: 500px;
  border: thin solid;
  transition: width 0.5s;
  width: ${(p) => (p.display ? 380 : 0)}px;
  background-color: white;
  padding: ${(p) => (p.display ? 20 : 0)}px;
`;

const FormsContainer = styled.div`
  margin-top: 40px;
  width: 100%;
`;

const ButtonGroups = styled.div<{ display: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: width 1s;
  width: ${(p) => (p.display ? '80%' : 0)};
  margin-bottom: 20px;
`;

const ActionButton = styled(Button)`
  width: 100%;
  margin: 10px;
`;

type Props = {
  type: TransactionType | undefined;
  display: boolean;
  onSendTx: () => void;
  onCancelled: () => void;
};

const TransactionPanel: FC<Props> = ({ type, display, onSendTx, onCancelled }) => {
  const [alert, setAlert] = useState('');
  const [params, setParams] = useState<TransactionKey>({});
  const signer = useSigner();
  const sdk = useContractSDK();

  const onTransactionFailed = (errorMsg: string) => {
    onCancelled();
    setAlert(errorMsg);
    setParams({});
  };

  const onTransactionComplete = () => {
    onSendTx();
    setParams({});
  };

  const onFormValueChanged = (key: string, value: string | number) => {
    const updatedParams = { ...params, [key]: value };
    setParams(updatedParams);
  };

  const sendTransaction = (type: TransactionType) => {
    switch (type) {
      case TransactionType.configCntroller: {
        configController(sdk, signer, params?.controllerAccount)
          .then(() => onTransactionComplete())
          .catch((errorMsg) => onTransactionFailed(errorMsg));
        break;
      }
      case TransactionType.startIndexing: {
        startIndexing(sdk, signer, params?.deploymentID)
          .then(() => onSendTx())
          .catch((errorMsg) => onTransactionFailed(errorMsg));
        break;
      }
      case TransactionType.stopIndexing: {
        stopIndexing(sdk, signer, params.deploymentID)
          .then(() => onSendTx())
          .catch((errorMsg) => onTransactionFailed(errorMsg));
        break;
      }
      case TransactionType.unregister: {
        unRegister(sdk, signer)
          .then(() => onSendTx())
          .catch((errorMsg) => onTransactionFailed(errorMsg));
        break;
      }
      default:
    }
  };

  const renderForms = () => {
    if (!type) return null;

    const data = transactionSchema[type];
    return (
      <FormsContainer>
        {data.map(({ title, key }) => {
          return (
            <InputField
              key={key}
              label={title}
              onChange={(value) => onFormValueChanged(key, value)}
            />
          );
        })}
        <InputField
          label="Gas Fee"
          value="1"
          disabled
          onChange={(value) => console.log('>>>:', value)}
        />
      </FormsContainer>
    );
  };

  return (
    <Container display={display}>
      {renderForms()}
      {display && (
        <ButtonGroups display={display}>
          <ActionButton
            variant="contained"
            color="primary"
            onClick={() => type && sendTransaction(type)}
          >
            Send Transaction
          </ActionButton>
          <ActionButton variant="contained" color="error" onClick={() => type && onCancelled()}>
            Cancel
          </ActionButton>
        </ButtonGroups>
      )}
      <Alert severity="error" message={alert} onClose={() => setAlert('')} />
    </Container>
  );
};

export default TransactionPanel;
