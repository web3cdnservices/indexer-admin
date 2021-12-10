// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { FC } from 'react';
import { Space, Spin } from 'antd';
import { useLoading } from 'containers/loadingContext';
import styled from 'styled-components';

const Container = styled.div`
  position: absolute;
  display: flex;
  width: 100%;
  height: 100%;
  z-index: 1000;
  background-color: #f6f9fc;
  justify-content: center;
  align-items: flex-start;
`;

const Loading: FC = () => {
  const { pageLoading } = useLoading();
  if (!pageLoading) return null;
  return (
    <Container>
      <Space size="middle">
        <Spin size="large" />
      </Space>
    </Container>
  );
};

export default Loading;
