// Copyright 2020-2022 SubQuery Pte Ltd authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useState } from 'react';

import { createContainer } from './unstated';

export type ToastProps = {
  type: 'error' | 'success' | 'info' | 'warning' | 'loading';
  text: string;
};

export type ToastContext = {
  toast: ToastProps | undefined;
  dispatchToast: (toast: ToastProps | undefined) => void;
  closeToast: () => void;
};

function useToastImpl(): ToastContext {
  const [toast, dispatchToast] = useState<ToastProps>();
  const closeToast = () => dispatchToast(undefined);

  return { toast, dispatchToast, closeToast };
}

export const { useContainer: useToast, Provider: ToastProvider } = createContainer(useToastImpl, {
  displayName: 'Global Toast',
});
