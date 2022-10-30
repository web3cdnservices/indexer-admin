// Copyright 2020-2022 SubQuery Pte Ltd authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useCallback, useEffect, useMemo } from 'react';
import { useLazyQuery, useMutation } from '@apollo/client';
import { FormikHelpers, FormikValues } from 'formik';

import { useModal } from 'containers/modalContext';
import { ProjectFormKey } from 'types/schemas';
import { ChannelStatus, GET_PAYG_PLANS, PAYG_PRICE } from 'utils/queries';

import { useProjectService } from './projectHook';
import { useWeb3 } from './web3Hook';

// hook for PAYG configuration
export function usePAYGConfig(deploymentId: string) {
  const [paygPriceRequest, { loading }] = useMutation(PAYG_PRICE);
  const { projectService, getProjectService } = useProjectService(deploymentId);
  const { removeModal } = useModal();

  const paygConfig = useMemo(
    () => ({
      paygPrice: projectService?.paygPrice ?? '',
      paygExpiration: projectService?.paygExpiration ?? 0,
    }),
    [projectService]
  );

  const changePAYGCofnig = useCallback(
    async (values: FormikValues, formHelper: FormikHelpers<FormikValues>) => {
      try {
        const { paygPrice, paygPeriod } = values;
        await paygPriceRequest({
          variables: {
            paygPrice: paygPrice.toString(),
            paygExpiration: Number(paygPeriod),
            // TODO: remove these 2 param on coordinator service side
            paygThreshold: 10,
            paygOverflow: 10,
            id: deploymentId,
          },
        });

        getProjectService();
        removeModal();
      } catch (e) {
        formHelper.setErrors({ [ProjectFormKey.paygPrice]: `Invalid PAYG: ${e}` });
      }
    },
    []
  );

  return { paygConfig, changePAYGCofnig, loading };
}

// hook for PAYG plans
export type Plan = {
  id: string;
  indexer: string;
  consumer: string;
  status: ChannelStatus;
  total: number;
  spent: number;
  isFinal: boolean;
  expiredAt: string;
  terminatedAt: string;
};

export function usePAYGPlans(deploymentId: string, status: ChannelStatus) {
  const [queryPAYGPlans, { data, loading }] = useLazyQuery(GET_PAYG_PLANS, {
    fetchPolicy: 'network-only',
  });

  const plans = useMemo((): [Plan] | undefined => data?.stateChannels.nodes, [data]);
  const { account: indexer } = useWeb3();

  const getPlans = useCallback(
    () =>
      queryPAYGPlans({
        variables: {
          indexer: '0xbB64D716FAbDEC3a106bb913Fb4f82c1EeC851b8',
          deploymentId,
          status,
        },
      }),
    [indexer, deploymentId, status]
  );

  useEffect(() => {
    indexer && getPlans();
  }, [indexer]);

  return { getPlans, plans, loading };
}

export function statusToTagState(status: ChannelStatus) {
  switch (status) {
    case ChannelStatus.OPEN:
      return { state: 'info', text: 'Active' };
    case ChannelStatus.TERMINATED:
      return { state: 'error', text: 'Terminated' };
    default:
      return { state: 'success', text: 'Completed' };
  }
}
