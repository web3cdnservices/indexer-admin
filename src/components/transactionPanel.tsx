// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import styled from '@emotion/styled';
import Button from '@mui/material/Button';
import { FC } from 'react';
import { TransactionType, transactionSchema } from '../utils/transactions';
import InputField from './inputField';

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

export const ActionButton = styled(Button)<{ display: boolean }>`
  transition: width 1s;
  width: ${(p) => (p.display ? '80%' : 0)};
  margin: 20px;
`;

type Props = {
  type: TransactionType | undefined;
  display: boolean;
  onClick: () => void;
};

const TransactionPanel: FC<Props> = ({ type, display, onClick }) => {
  const renderForms = () => {
    if (!type) return null;

    const data = transactionSchema[type];
    return (
      <FormsContainer>
        {data.map((item) => {
          return <InputField label={item.title} onChange={(value) => console.log('>>>:', value)} />;
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
        <ActionButton
          display={display}
          variant="contained"
          color="secondary"
          onClick={() => onClick()}
        >
          Send Transaction
        </ActionButton>
      )}
    </Container>
  );
};

export default TransactionPanel;
