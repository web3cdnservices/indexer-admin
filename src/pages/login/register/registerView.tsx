// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { FC } from 'react';
import { Title, SubTitle, StyledButton } from '../styles';
import { ContentContainer, DescContainer } from './styles';
import prompts from './prompts';
import { RegisterStep } from './types';

type Props = {
  step: RegisterStep;
  onClick: () => void;
};

const RegisterView: FC<Props> = ({ step, onClick }) => {
  const { title, desc, buttonTitle } = prompts[step];
  return (
    <ContentContainer>
      <Title size={40} align="center" weight="500">
        {title}
      </Title>
      <DescContainer mt={40}>
        <SubTitle align="center">{desc}</SubTitle>
      </DescContainer>
      <StyledButton width="20%" type="primary" shape="round" size="large" onClick={onClick}>
        {buttonTitle}
      </StyledButton>
    </ContentContainer>
  );
};

export default RegisterView;
