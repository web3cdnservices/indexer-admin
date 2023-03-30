// Copyright 2020-2022 SubQuery Pte Ltd authors & contributors
// SPDX-License-Identifier: Apache-2.0

export function balanceSufficient(balance: string): boolean {
  return parseFloat(balance) > parseFloat('0.05');
}

// TODO: get the explorer address from contract sdk
export function openAccountExporer(account: string) {
  const url = `https://mumbai.polygonscan.com/address/${account}`;
  window.open(url, '_blank', 'noopener,noreferrer');
}
