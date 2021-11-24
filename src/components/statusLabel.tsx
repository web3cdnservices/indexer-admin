// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { FC } from 'react';
import styled from 'styled-components';

const Container = styled.div<{ color?: string }>`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${(p) => p.color ?? 'lightgreen'};
  border-radius: 5px;
  padding: 5px 10px;
`;

const Text = styled.div`
  font-size: 13px;
  color: black;
`;

type Props = {
  text: string;
  color?: string;
};

const StatusLabel: FC<Props> = ({ text, color }) => (
  <Container color={color}>
    <Text>{text}</Text>
  </Container>
);

export default StatusLabel;
