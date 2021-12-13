// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { FC } from 'react';

import { Button } from 'components/primary';

import { SubTitle, Title } from '../login/styles';
import prompts from './prompts';
import { ContentContainer, DescContainer, TextContainer } from './styles';
import { RegisterStep } from './types';

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
      <Button width={350} type="primary" title={buttonTitle} loading={loading} onClick={onClick} />
    </ContentContainer>
  );
};

export default RegisterView;
