// Copyright 2020-2022 SubQuery Pte Ltd authors & contributors
// SPDX-License-Identifier: Apache-2.0

export function balanceSufficient(balance: string): boolean {
  return parseFloat(balance) > parseFloat('0.2');
}

export function openAccountExporer(account: string) {
  const url = `https://moonbase.moonscan.io/address/${account}`;
  window.open(url, '_blank', 'noopener,noreferrer');
}
