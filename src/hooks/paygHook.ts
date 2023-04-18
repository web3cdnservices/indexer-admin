// Copyright 2020-2022 SubQuery Pte Ltd authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useCallback, useEffect, useMemo, useState } from 'react';
import { ApolloQueryResult, useMutation } from '@apollo/client';
import { formatEther, parseEther } from '@ethersproject/units';
import { GraphqlQueryClient, NETWORK_CONFIGS } from '@subql/network-clients';
import { GetIndexerClosedFlexPlans, GetIndexerOngoingFlexPlans } from '@subql/network-query';
import { BigNumber } from 'ethers';
import { FormikHelpers, FormikValues } from 'formik';

import { ProjectFormKey } from 'types/schemas';
import { PAYG_PRICE } from 'utils/queries';

import { useProjectService } from './projectHook';
import { useWeb3 } from './web3Hook';

export enum FlexPlanStatus {
  ONGOING,
  CLOSED,
}

const daySeconds = 3600 * 24;

// hook for PAYG configuration
export function usePAYGConfig(deploymentId: string) {
  const [paygPriceRequest, { loading }] = useMutation(PAYG_PRICE);
  const { projectService, getProjectService } = useProjectService(deploymentId);

  const paygConfig = useMemo(() => {
    if (!projectService || !projectService.paygPrice) {
      return { paygPrice: '', paygExpiration: 0 };
    }

    return {
      paygPrice: formatEther(BigNumber.from(projectService.paygPrice).mul(1000)),
      paygExpiration: (projectService?.paygExpiration ?? 0) / daySeconds,
    };
  }, [projectService]);

  const changePAYGCofnig = useCallback(
    async (values: FormikValues, formHelper: FormikHelpers<FormikValues>) => {
      try {
        const { paygPrice, paygPeriod } = values;
        const price = parseEther(paygPrice);
        await paygPriceRequest({
          variables: {
            paygPrice: price.div(1000).toString(),
            paygExpiration: Number(paygPeriod * daySeconds),
            // TODO: remove these 2 param on coordinator service side
            paygThreshold: 10,
            paygOverflow: 10,
            id: deploymentId,
          },
        });

        getProjectService();
      } catch (e) {
        formHelper.setErrors({ [ProjectFormKey.paygPrice]: `Invalid PAYG: ${e}` });
      }
    },
    [deploymentId, getProjectService, paygPriceRequest]
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
const { networkClient } = client;

function queryFromStatus(status: FlexPlanStatus) {
  return status === FlexPlanStatus.ONGOING ? GetIndexerOngoingFlexPlans : GetIndexerClosedFlexPlans;
}

export function usePAYGPlans(deploymentId: string) {
  const [data, setData] = useState<ApolloQueryResult<{ stateChannels: { nodes: Plan[] } }>>();

  const plans = useMemo((): Plan[] | undefined => data?.data.stateChannels.nodes, [data]);
  const { account: indexer } = useWeb3();

  const getPlans = useCallback(
    async (id: string, status: FlexPlanStatus) => {
      if (!indexer) return;
      const response = await networkClient.query({
        query: queryFromStatus(status),
        variables: {
          indexer,
          deploymentId: id,
          now: new Date(),
        },
      });
      setData(response);
    },
    [indexer]
  );

  useEffect(() => {
    indexer && getPlans(deploymentId, FlexPlanStatus.ONGOING);
  }, [deploymentId, getPlans, indexer]);

  return { getPlans, plans };
}
