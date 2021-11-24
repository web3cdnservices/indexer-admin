// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0px 50px;
`;

export const Separator = styled.div<{ height?: number }>`
  min-height: 20px;
  height: ${(p) => p.height || 20}px;
`;
