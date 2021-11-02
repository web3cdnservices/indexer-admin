// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import styled from '@emotion/styled';
import Button from '@mui/material/Button';
import { FC, useState } from 'react';
import { useContractSDK } from '../containers/contractSdk';
import { useSigner } from '../hooks/web3Hook';
import {
  indexerRegistry,
  configController,
  startIndexing,
  stopIndexing,
} from '../utils/indexerActions';
import { TransactionType, transactionSchema } from '../utils/transactions';
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
`;

const ActionButton = styled(Button)<{ display: boolean }>`
  width: 100%;
  margin: 10px;
`;

type Props = {
  type: TransactionType | undefined;
  display: boolean;
  onSendTx: () => void;
  onCancelled: () => void;
};

// FIME: for testing
const testDeploymentId = '0xbec921276c8067fe0c82def3e5ecfd8447f1961bc85768c2a56e6bd26d3c0c55';
const testController = '0x3Cd0A705a2DC65e5b1E1205896BaA2be8A07c6e0';

const TransactionPanel: FC<Props> = ({ type, display, onSendTx, onCancelled }) => {
  const [alert, setAlert] = useState('');
  const signer = useSigner();
  const sdk = useContractSDK();

  const onTransactionFailed = (errorMsg: string) => {
    onCancelled();
    setAlert(errorMsg);
  };

  const sendTransaction = (type: TransactionType) => {
    switch (type) {
      case TransactionType.registry: {
        indexerRegistry(sdk, signer, 10000000)
          .then(() => onSendTx)
          .catch((errorMsg) => onTransactionFailed(errorMsg));
        break;
      }
      case TransactionType.configCntroller: {
        configController(sdk, signer, testController)
          .then(() => onSendTx())
          .catch((errorMsg) => onTransactionFailed(errorMsg));
        break;
      }
      case TransactionType.startIndexing: {
        startIndexing(sdk, signer, testDeploymentId)
          .then(() => onSendTx())
          .catch((errorMsg) => onTransactionFailed(errorMsg));
        break;
      }
      case TransactionType.stopIndexing: {
        stopIndexing(sdk, signer, testDeploymentId)
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
        {data.map(({ title }) => {
          return (
            <InputField
              key={title}
              label={title}
              onChange={(value) => console.log('>>>:', value)}
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
            display={display}
            variant="contained"
            color="primary"
            onClick={() => type && sendTransaction(type)}
          >
            Send Transaction
          </ActionButton>
          <ActionButton
            display={display}
            variant="contained"
            color="error"
            onClick={() => type && onCancelled()}
          >
            Cancel
          </ActionButton>
        </ButtonGroups>
      )}
      <Alert message={alert} onClose={() => setAlert('')} />
    </Container>
  );
};

export default TransactionPanel;
