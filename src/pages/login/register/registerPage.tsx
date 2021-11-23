// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useState } from 'react';
import { Container } from '../styles';
import RegisterView from './registerView';
import { RegisterStep } from './types';

const RegisterPage = () => {
  const [currentStep, setStep] = useState<RegisterStep>(RegisterStep.onboarding);

  const isStep = (step: RegisterStep) => currentStep === step;

  // TODO: progress bar
  const startRegistry = () => {
    setStep(RegisterStep.authorisation);
  };

  const requestAuthorisation = () => {
    // TODO: send tx to request approve

    setStep(RegisterStep.register);
  };

  const indexerRegistry = () => {
    // TODO: send tx to register indexer

    setStep(RegisterStep.sync);
  };

  const syncIndexer = () => {
    // TODO: 1. call coordinator service to add indexer
    // 2. switch to account management page
  };

  const registerActions = {
    [RegisterStep.onboarding]: startRegistry,
    [RegisterStep.authorisation]: requestAuthorisation,
    [RegisterStep.register]: indexerRegistry,
    [RegisterStep.sync]: syncIndexer,
  };

  // TODO: as register step has forms, need to handle seperately

  return (
    <Container>
      <RegisterView step={currentStep} onClick={registerActions[currentStep]} />
    </Container>
  );
};

export default RegisterPage;
