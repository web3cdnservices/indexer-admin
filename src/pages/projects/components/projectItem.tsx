// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  width: 100%;
  min-width: 600px;
  min-height: 100px;
  margin: 10px 0px;
`;

const ContentContainer = styled.div<{ flex?: number; color?: string }>`
  display: flex;
  flex: ${({ flex }) => flex ?? 1};
  background-color: ${({ color }) => color ?? 'gray'};
`;

const ProjectItem = () => {
  return (
    <Container>
      <ContentContainer flex={4} color="green" />
      <ContentContainer flex={3} color="blue" />
      <ContentContainer flex={1} color="pink" />
    </Container>
  );
};

export default ProjectItem;
