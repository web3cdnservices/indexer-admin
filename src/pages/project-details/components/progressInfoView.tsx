// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';
import { Progress } from 'antd';

const Container = styled.div`
  display: flex;
  flex: 1;
  min-width: 350px;
  min-height: 80px;
`;

const ProgressBar = styled(Progress)`
  min-width: 300;
  margin-right: 20px;
`;

const ProgressInfoView = () => {
  return (
    <Container>
      <ProgressBar
        percent={70}
        strokeColor={{
          '0%': '#4388dd',
          '100%': '#ff4581',
        }}
      />
    </Container>
  );
};

export default ProgressInfoView;
