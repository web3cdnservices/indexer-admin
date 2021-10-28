// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import styled from '@emotion/styled';
import TextField from '@mui/material/TextField';
import { FC } from 'react';

type Props = {
  label: string;
  value: number | string;
  onChange: (this: Window, ev: Event) => any;
};

const StyledTextField = styled(TextField)`
  border-color: white;
  color: white;
`;

const InputField: FC<Props> = ({ value }) => {
  return <StyledTextField value={value} color="primary" />;
};

export default InputField;
