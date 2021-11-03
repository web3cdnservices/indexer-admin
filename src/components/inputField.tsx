// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import styled from '@emotion/styled';
import TextField from '@mui/material/TextField';
import { FC } from 'react';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 30px;
`;

const StyledTextField = styled(TextField)`
  border-color: white;
  color: white;
  width: 100%;
`;

const Text = styled.div`
  margin-right: 20px;
  color: black;
  margin-bottom: 20px;
  font-weight: bold;
`;

type Props = {
  label: string;
  value?: number | string;
  disabled?: boolean;
  onChange: (value: string | number) => any;
};

const InputField: FC<Props> = ({ label, value, onChange, disabled = false }) => {
  return (
    <Container>
      <Text>{label}</Text>
      <StyledTextField
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
        color="primary"
        value={value}
      />
    </Container>
  );
};

export default InputField;
