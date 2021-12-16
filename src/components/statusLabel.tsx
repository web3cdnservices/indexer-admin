// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { FC } from 'react';
import styled from 'styled-components';

const Container = styled.div<{ color?: string }>`
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid;
  border-color: ${(p) => p.color ?? 'rgba(70, 219, 103, 0.9)'};
  border-radius: 5px;
  padding: 5px 10px;
  min-width: 80px;
`;

const Text = styled.div<{ color?: string }>`
  font-size: 13px;
  font-weight: bold;
  color: ${(p) => p.color ?? 'rgba(70, 219, 103, 0.9)'};
`;

type Props = {
  text: string;
  color?: string;
};

const StatusLabel: FC<Props> = ({ text, color }) => (
  <Container color={color}>
    <Text color={color}>{text}</Text>
  </Container>
);

export default StatusLabel;
