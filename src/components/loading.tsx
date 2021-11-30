// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Spin, Space } from 'antd';
import { FC } from 'react';

const Loading: FC = () => (
  <Space size="middle">
    <Spin size="large" />
  </Space>
);

export default Loading;
