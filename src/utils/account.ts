// Copyright 2020-2022 SubQuery Pte Ltd authors & contributors
// SPDX-License-Identifier: Apache-2.0

export function balanceSufficient(balance: string): boolean {
  return parseFloat(balance) > parseFloat('0.08');
}
