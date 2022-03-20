// Copyright 2020-2022 SubQuery Pte Ltd authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { FC, useEffect, useMemo } from 'react';
import { useLazyQuery } from '@apollo/client';
import { Button, Toolbar, ToolbarContent, ToolbarItem } from '@patternfly/react-core';
import { LogViewer } from '@patternfly/react-log-viewer';

import { GET_LOG } from 'utils/queries';

const ProjectLogView: FC<{ container: string }> = ({ container }) => {
  const [getLog, { loading, data, error }] = useLazyQuery(GET_LOG, {
    fetchPolicy: 'network-only',
  });

  useEffect(() => {
    getLog({ variables: { container } });
  }, []);

  const log = useMemo(() => {
    if (loading || error) return '';
    return data?.getLog.log;
  }, [data, loading]);

  const renderToolBar = () => (
    <Toolbar>
      <ToolbarContent>
        <ToolbarItem>
          <Button onClick={() => getLog({ variables: { container } })} variant="control">
            Refresh
          </Button>
        </ToolbarItem>
      </ToolbarContent>
    </Toolbar>
  );

  return (
    <div style={{ marginTop: 20 }}>
      {!!log && (
        <LogViewer hasLineNumbers height={300} data={log} theme="dark" toolbar={renderToolBar()} />
      )}
    </div>
  );
};

export default ProjectLogView;
