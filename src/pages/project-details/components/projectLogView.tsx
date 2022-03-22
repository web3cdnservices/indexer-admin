// Copyright 2020-2022 SubQuery Pte Ltd authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { FC, useEffect, useMemo } from 'react';
import { useLazyQuery } from '@apollo/client';
import { LogViewer } from '@patternfly/react-log-viewer';
import { Button, Spinner } from '@subql/react-ui';
import styled from 'styled-components';

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

  // TODO: resolve the dark theme issue
  return (
    <Container>
      <StyledButton
        size="small"
        type="secondary"
        label="Refresh"
        onClick={() => getLog({ variables: { container } })}
      />
      {!!log && <LogViewer hasLineNumbers height={600} data={log} isTextWrapped theme="dark" />}
      {loading && <Spinner />}
    </Container>
  );
};

export default ProjectLogView;

const Container = styled.div`
  height: 600px;
  padding: 20px;
  margin-top: 10px;
  background-color: #121212;
`;

const StyledButton = styled(Button)`
  margin-bottom: 10px;
  height: 30px;
  width: 100px;
`;
