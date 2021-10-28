// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import Button from '@mui/material/Button';
import { useWeb3, connect } from '../../containers/web3';
import TokenBalance from '../../components/balance';
import { Container } from './styles';

const Projects = () => {
  const { account, chainId, activate, active } = useWeb3();

  return (
    <Container>
      <div>Connect with: {account}</div>
      <div>Chain ID: {chainId}</div>
      <div>Connection: {active.toString()}</div>
      {!active && (
        <Button
          style={{ borderWidth: 1, borderColor: 'blue' }}
          color="primary"
          onClick={() => connect(activate)}
        >
          Conenct MetaMask
        </Button>
      )}
      {account && <TokenBalance account={account} />}
    </Container>
  );
};

export default Projects;
