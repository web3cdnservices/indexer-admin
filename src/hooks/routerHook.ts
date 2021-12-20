// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useEffect } from 'react';
import { useHistory } from 'react-router';
import { isUndefined } from 'lodash';

import { useLoading } from 'containers/loadingContext';
import { isFalse } from 'utils/validateService';

import { useController, useIsIndexer } from './indexerHook';

export const useRouter = () => {
  const isIndexer = useIsIndexer();
  const controller = useController();
  const history = useHistory();
  const { setPageLoading } = useLoading();

  useEffect(() => {
    setPageLoading(isUndefined(isIndexer) || isUndefined(controller));
    if (isFalse(isIndexer)) {
      history.replace('/');
    } else if (isFalse(controller)) {
      history.replace('/account');
    }
  }, [isIndexer, controller]);
};
