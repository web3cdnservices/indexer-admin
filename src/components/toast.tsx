// Copyright 2020-2021 OnFinality Limited authors & contributors
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
  margin-top: -10px;
  justify-content: center;
  align-items: flex-start;
`;

const Toast: FC = () => {
  const { toast } = useToast();
  if (!toast) return null;
  return (
    <Container>
      <SubToast state={toast.type} text={toast.text} />
    </Container>
  );
};

export default Toast;
