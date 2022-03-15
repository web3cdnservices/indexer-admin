// Copyright 2020-2022 SubQuery Pte Ltd authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { FC } from 'react';
import styled from 'styled-components';

import { Text } from './primary';

const VersionItemContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`;

type VersionProps = {
  versionType: string;
  value?: string | number;
  prefix?: string;
};

export const TagItem: FC<VersionProps> = ({ versionType, value = '', prefix = '' }) => {
  const color = prefix ? '#4388dd' : 'gray';
  return (
    <VersionItemContainer>
      <Text size={15} fw="500">
        {versionType}
      </Text>
      <Text mt={5} color={color} fw="500" size={13}>
        {`${prefix}${value}`}
      </Text>
    </VersionItemContainer>
  );
};
