// Copyright 2020-2022 SubQuery Pte Ltd authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useCallback, useEffect, useMemo, useState } from 'react';
import { ApolloQueryResult, useMutation } from '@apollo/client';
import { formatEther, parseEther } from '@ethersproject/units';
import { GraphqlQueryClient, NETWORK_CONFIGS } from '@subql/network-clients';
import { FormikHelpers, FormikValues } from 'formik';

import { useModal } from 'containers/modalContext';
import { ProjectFormKey } from 'types/schemas';
import { GET_PAYG_PLANS, PAYG_PRICE } from 'utils/queries';

import { useProjectService } from './projectHook';
import { useWeb3 } from './web3Hook';

const daySeconds = 3600 * 24;

// hook for PAYG configuration
export function usePAYGConfig(deploymentId: string) {
  const [paygPriceRequest, { loading }] = useMutation(PAYG_PRICE);
  const { projectService, getProjectService } = useProjectService(deploymentId);
  const { removeModal } = useModal();

  const paygConfig = useMemo(
    () => ({
      paygPrice: formatEther(projectService?.paygPrice ?? 0),
      paygExpiration: (projectService?.paygExpiration ?? 0) / daySeconds,
    }),
    [projectService]
  );

  const changePAYGCofnig = useCallback(
    async (values: FormikValues, formHelper: FormikHelpers<FormikValues>) => {
      try {
        const { paygPrice, paygPeriod } = values;
        const price = parseEther(paygPrice);
        await paygPriceRequest({
          variables: {
            paygPrice: price.toString(),
            paygExpiration: Number(paygPeriod * daySeconds),
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
export enum ChannelStatus {
  FINALIZED = 'FINALIZED',
  OPEN = 'OPEN',
  TERMINATED = 'TERMINATED',
}

export type Plan = {
  id: string;
  indexer: string;
  consumer: string;
  status: ChannelStatus;
  total: number; // deposit SQT amount
  spent: number;
  isFinal: boolean;
  expiredAt: string;
  terminatedAt: string;
};

const config = NETWORK_CONFIGS.kepler;
const client = new GraphqlQueryClient(config);
const networkClient = client.explorerClient;

export function usePAYGPlans(deploymentId: string) {
  const [data, setData] = useState<ApolloQueryResult<{ stateChannels: { nodes: Plan[] } }>>();

  const plans = useMemo((): Plan[] | undefined => data?.data.stateChannels.nodes, [data]);
  const { account: indexer } = useWeb3();

  const getPlans = useCallback(
    async (id: string, _status: ChannelStatus) => {
      const response = await networkClient.query({
        query: GET_PAYG_PLANS,
        variables: {
          indexer: '0xbB64D716FAbDEC3a106bb913Fb4f82c1EeC851b8',
          deploymentId: id,
          status: _status,
        },
      });
      setData(response);
    },
    [indexer, deploymentId]
  );

  useEffect(() => {
    indexer && getPlans(deploymentId, ChannelStatus.OPEN);
  }, [indexer]);

  return { getPlans, plans };
}
