// Copyright 2020-2022 SubQuery Pte Ltd authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { FC } from 'react';
import { Toast as SubToast } from '@subql/react-ui';
import styled from 'styled-components';

import { useToast } from 'containers/toastContext';

const Container = styled.div`
  position: absolute;
  display: flex;
  width: 100%;
  height: 50;
  z-index: 1000;
  justify-content: center;
  align-items: flex-start;
`;

const Toast: FC = () => {
  const { toast } = useToast();
  return toast ? (
    <Container>
      <SubToast state={toast.type} text={toast.text} />
    </Container>
  ) : null;
};

export default Toast;
