// Copyright 2020-2022 SubQuery Pte Ltd authors & contributors
// SPDX-License-Identifier: Apache-2.0

export enum HealthStatus {
  healthy = 'HEALTHY',
  unhealthy = 'UNHEALTHY',
}

export function calculateProgress(targetHeight: number, latestHeight: number): number {
  if (targetHeight === 0) return 0;
  if (latestHeight >= targetHeight) return 100;
  return Math.round((latestHeight * 100 * 100) / targetHeight) / 100;
}

export function healthStatus(status: boolean): HealthStatus {
  return status ? HealthStatus.healthy : HealthStatus.unhealthy;
}

export function getProxyServiceUrl(id: string): string {
  return `${window.env.COORDINATOR_HOST}/query/${id}`;
}
