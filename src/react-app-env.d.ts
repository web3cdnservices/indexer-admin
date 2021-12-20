// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

console.log('react-app-evn');


interface Window {
  ethereum?: any;
  env: Record<string, string>;
}
