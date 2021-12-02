// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';
import { Form, Steps } from 'antd';

export const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  border-radius: 18px;
  background-color: white;
  margin-bottom: 50px;
  padding: 60px;
  min-width: 650px;
  min-height: 450px;
  width: 60%;
`;

export const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const DescContainer = styled.div<{ mt?: number }>`
  margin-top: ${(p) => p.mt ?? 0}px;
  width: 450px;
`;

export const RegistrySteps = styled(Steps)`
  width: 65%;
  margin-bottom: 70px;
  min-width: 750px;
`;

export const FormContainer = styled(Form)`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
  min-width: 600px;
  margin-top: 30px;
`;
