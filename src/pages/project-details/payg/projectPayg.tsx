// Copyright 2020-2022 SubQuery Pte Ltd authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useMemo } from 'react';

import { useModal } from 'containers/modalContext';
import { usePAYGConfig } from 'hooks/paygHook';

import { createPaygOpenSteps } from '../config';
import { ProjectConfig } from '../types';
import { PAYGConfig } from './paygConfig';
import { Introduction } from './paygIntroduction';
import { PAYGPlan } from './paygPlans';
import { Container } from './styles';

type TProjectPAYG = {
  id: string;
  config: ProjectConfig;
  paygUpdated?: () => void;
};

export function ProjectPAYG({ id, config }: TProjectPAYG) {
  const { paygConfig, changePAYGCofnig, loading } = usePAYGConfig(id);
  const { paygPrice, paygExpiration } = paygConfig ?? config;
  const { showModal } = useModal();

  const paygEnabled = useMemo(() => paygPrice && paygExpiration, [paygPrice, paygExpiration]);

  const paygOpenSteps = createPaygOpenSteps(config, changePAYGCofnig);

  const onUpdatePayg = (title: string) => {
    const modalItem = {
      visible: true,
      steps: paygOpenSteps,
      title,
      loading,
    };
    showModal(modalItem);
  };

  return (
    <Container>
      {!paygEnabled && <Introduction onEnablePayg={() => onUpdatePayg('Enable Flex Plan')} />}
      {paygEnabled && (
        <PAYGConfig
          price={paygPrice}
          period={paygExpiration}
          onEdit={() => onUpdatePayg('Update Flex Plan')}
        />
      )}
      {paygEnabled && <PAYGPlan deploymentId={id} />}
    </Container>
  );
}
