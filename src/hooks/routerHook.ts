// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useEffect } from 'react';
import { useHistory } from 'react-router';
import { isUndefined } from 'lodash';

import { useLoading } from 'containers/loadingContext';
import { isFalse } from 'utils/validateService';

import { useController, useIsIndexer } from './indexerHook';

export const useRouter = (refresh = true) => {
  const isIndexer = useIsIndexer();
  const controller = useController();
  const history = useHistory();
  const { pageLoading, setPageLoading } = useLoading();

  useEffect(() => {
    setPageLoading(isUndefined(isIndexer) || isUndefined(controller));
    if (pageLoading || !refresh) return;

    if (isFalse(isIndexer)) {
      history.replace('/');
      console.log('fff');
    } else if (isFalse(controller)) {
      history.replace('/account');
      console.log('dddd');
    }
  }, [isIndexer, controller]);
};
