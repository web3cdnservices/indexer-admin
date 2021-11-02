// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import { FC } from 'react';

type Props = {
  message: string;
  onClose: () => void;
};

const IndexerAlert: FC<Props> = ({ message, onClose }) => {
  return message ? (
    <Snackbar open={!!message} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
      <Alert severity="error" onClose={onClose} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  ) : null;
};

export default IndexerAlert;
