// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

export function registerIndexer(amount: number): boolean {
  return !amount;
}

export function unregisterIndexer() {
  return false;
}

export function startIndexing(deployment: string): boolean {
  return !deployment;
}

export function stopIndexing(deployment: string): boolean {
  return !deployment;
}
