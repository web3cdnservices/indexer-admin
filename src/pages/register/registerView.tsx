// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { FC } from 'react';
import { Title, SubTitle } from '../login/styles';
import { ContentContainer, DescContainer, TextContainer } from './styles';
import prompts from './prompts';
import { RegisterStep } from './types';
import { SButton } from '../../components/primary';

type Props = {
  step: RegisterStep;
  loading: boolean;
  onClick: () => void;
};

const RegisterView: FC<Props> = ({ step, onClick, loading }) => {
  const { title, desc, buttonTitle } = prompts[step];
  return (
    <ContentContainer>
      <TextContainer>
        <Title size={35} align="center" weight="500">
          {title}
        </Title>
        <DescContainer mt={20}>
          <SubTitle align="center">{desc}</SubTitle>
        </DescContainer>
      </TextContainer>
      <SButton width={350} title={buttonTitle} onClick={onClick} />
    </ContentContainer>
  );
};

export default RegisterView;
