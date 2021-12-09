// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { FC } from 'react';
import { Space, Spin } from 'antd';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  width: 100%;
  height: 10%;
  align-items: center;
  justify-content: center;
`;

const Loading: FC = () => (
  <Container>
    <Space size="middle">
      <Spin size="large" />
    </Space>
  </Container>
);

export default Loading;
