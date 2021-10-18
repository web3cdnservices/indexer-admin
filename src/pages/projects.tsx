// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useWeb3 } from '../containers';
import { unregisterIndexer } from '../utils/contract';

const Projects = () => {
  const { active, account } = useWeb3();
  unregisterIndexer();
  return (
    <div
      style={{
        display: 'flex',
        width: 100,
        height: 200,
        backgroundColor: 'white',
        alignItems: 'center',
      }}
    >
      {active ? (
        <span>
          Connected with <b>{account}</b>
        </span>
      ) : (
        <span>Not connected</span>
      )}
    </div>
  );
};

export default Projects;
