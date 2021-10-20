// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import useSWR from 'swr';
import Button from '@mui/material/Button';
import { useWeb3, connect } from '../containers/web3';
import { fetcher } from '../utils/fetcher';
import TokenBalance from '../containers/TokenBalance';
// import { unregisterIndexer } from '../utils/contract';

const contractAddress = '0x3ed62137c5DB927cb137c26455969116BF0c23Cb';

const Projects = () => {
  const { active, account, chainId, library, activate } = useWeb3();
  // const { data: balance, mutate } = useSWR(['getBalance', account, 'latest'], {
  //   fetcher: fetcher(library),
  // });
  // console.log('>>balance:', balance);

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
        <TokenBalance address={contractAddress} />
      </div>
    </div>
  );
};

export default Projects;
