// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';
import { Form } from 'formik';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  min-height: 400px;
  align-items: center;
  justify-content: center;
  background-color: #f6f9fc;
`;

export const Panel = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  background-color: white;
  width: 610px;
  min-height: 580px;
  border-radius: 18px;
  padding: 50px;
  padding-top: 105px;
  margin-top: -50px;
  align-self: center;
`;

export const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

// TODO: replace these components with `Text`
export const Title = styled.div<{ size?: number; align?: string; weight?: string }>`
  text-align: ${(p) => p.align || 'left'};
  font-weight: ${(p) => p.weight || 'bold'};
  font-size: ${(p) => p.size || 28}px;
`;

export const SubTitle = styled.div<{ align?: string }>`
  text-align: ${(p) => p.align || 'left'};
  font-size: 16px;
  margin-top: 15px;
`;

export const LoginForm = styled(Form)`
  margin-top: 25px;
  width: 100%;
`;

export const ImageCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  border: thin solid;
  border-color: lightgray;
  border-radius: 16px;
`;

export const Image = styled.img`
  width: 120px;
  height: 120px;
`;
