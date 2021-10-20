// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import Button from '@mui/material/Button';
import { useWeb3, connect } from '../containers/web3';
import TokenBalance from '../containers/tokenBalance';

const Projects = () => {
  const { account, chainId, activate } = useWeb3();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        backgroundColor: 'lightblue',
        alignItems: 'center',
        paddingTop: 100,
        paddingBottom: 100,
      }}
    >
      <div>
        <div>Connect with: {account}</div>
        <div>Chain ID: {chainId}</div>
        <Button
          style={{ borderWidth: 1, borderColor: 'blue' }}
          color="primary"
          onClick={() => connect(activate)}
        >
          Conenct MetaMask
        </Button>
        {account && <TokenBalance account={account} />}
      </div>
    </div>
  );
};

export default Projects;
