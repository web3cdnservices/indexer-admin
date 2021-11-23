// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';

export const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 18px;
  background-color: white;
  padding: 40px;
  width: 70%;
  height: 60%;
`;

export const DescContainer = styled.div<{ mt?: number }>`
  margin-top: ${(p) => p.mt ?? 0}px;
  width: 540px;
`;
