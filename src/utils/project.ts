// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

enum HealthStatus {
  healthy = 'Healthy',
  unhealthy = 'UnHealthy',
}

export function calculateProgress(targetHeight: number, latestHeight: number): number {
  if (targetHeight === 0) return 0;
  if (latestHeight >= targetHeight) return 100;
  return Math.round((latestHeight * 100 * 100) / targetHeight) / 100;
}

export function healthStatus(status: boolean): HealthStatus {
  return status ? HealthStatus.healthy : HealthStatus.unhealthy;
}
