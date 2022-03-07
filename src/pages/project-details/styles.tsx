// Copyright 2020-2022 SubQuery Pte Ltd authors & contributors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-width: 1270px;
  padding: 0px 50px;
  padding-bottom: 50px;
`;

export const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  -ms-overflow-style: none; /* for Internet Explorer, Edge */
  scrollbar-width: none; /* for Firefox */
  overflow-y: scroll;
  ::-webkit-scrollbar {
    display: none; /* for Chrome, Safari, and Opera */
  }
`;
