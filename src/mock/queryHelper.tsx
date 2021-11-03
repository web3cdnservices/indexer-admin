// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import styled from '@emotion/styled';
import Button from '@mui/material/Button';
import { FC } from 'react';
import { useContractSDK } from '../containers/contractSdk';
import { useSigner } from '../hooks/web3Hook';
import { createQueryProject } from './queryRegistry';

const Container = styled.div`
  position: absolute;
  top: 150px;
  left: 0px;
  display: flex;
  height: 30px;
  border: thin solid;
  width: 260px;
  background-color: #191d27;
`;

const Helper = styled.div`
  height: 10px;
  width: 60px;
  background-color: #7450cf;
  padding: 10px;
  color: white;
`;

// const ContentContainer = styled.div`
//   display: flex;
//   height: 100%;
//   width: 100%;
//   background-color: #191d27;
// `;

const ActionButton = styled(Button)`
  width: 100%;
`;

const QueryHelper: FC = () => {
  const signer = useSigner();
  const sdk = useContractSDK();

  return (
    <Container>
      <ActionButton
        variant="contained"
        color="primary"
        onClick={() => createQueryProject(sdk, signer)}
      >
        Create Project
      </ActionButton>
    </Container>
  );
};

export default QueryHelper;
