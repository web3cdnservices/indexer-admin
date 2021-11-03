// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import Alert, { AlertColor } from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import { FC } from 'react';

type Props = {
  severity: AlertColor;
  message: string;
  onClose: () => void;
};

const IndexerAlert: FC<Props> = ({ message, onClose, severity = 'error' }) => {
  return message ? (
    <Snackbar open={!!message} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
      <Alert severity={severity} onClose={onClose} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  ) : null;
};

export default IndexerAlert;
