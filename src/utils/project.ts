// Copyright 2020-2022 SubQuery Pte Ltd authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { isUndefined } from 'lodash';

export enum ServiceStatus {
  healthy = 'HEALTHY',
  unhealthy = 'UNHEALTHY',
  terminated = 'TERMINATED',
}

export function calculateProgress(targetHeight: number, latestHeight: number): number {
  if (targetHeight === 0) return 0;
  if (latestHeight >= targetHeight) return 100;
  return Math.round((latestHeight * 100 * 100) / targetHeight) / 100;
}

export function serviceStatus(status: boolean | undefined): ServiceStatus {
  if (isUndefined(status)) return ServiceStatus.terminated;
  return status ? ServiceStatus.healthy : ServiceStatus.unhealthy;
}

export function getProxyServiceUrl(id: string): string {
  return `${window.env.PROXY_SERVICE_URL}/query/${id}`;
}

export function projectId(cid: string): string {
  return cid.substring(0, 15).toLowerCase();
}
