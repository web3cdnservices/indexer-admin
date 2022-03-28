// Copyright 2020-2022 SubQuery Pte Ltd authors & contributors
// SPDX-License-Identifier: Apache-2.0

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

export function statusCode(status: string): 'success' | 'error' {
  if (status === 'HEALTHY' || status === 'STARTING') return 'success';
  return 'error';
}

export function projectId(cid: string): string {
  return cid.substring(0, 15).toLowerCase();
}
