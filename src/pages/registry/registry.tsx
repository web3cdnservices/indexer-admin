// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useContractSDK } from '../../containers/contractSdk';
import { Container, ActionButton } from './styles';

const Registry = () => {
  const sdk = useContractSDK();

  const registry = () => {
    if (!sdk) console.log('sdk not initialised');
    sdk?.indexerRegistry.registerIndexer(1000000000);
  };

  const unRegister = () => {
    if (!sdk) console.log('sdk not initialised');
    sdk?.indexerRegistry.unregisterIndexer();
  };

  return (
    <Container>
      <ActionButton variant="contained" color="primary" onClick={() => registry()}>
        Registry
      </ActionButton>
      <ActionButton variant="contained" color="primary" onClick={() => unRegister()}>
        Unregistry
      </ActionButton>
    </Container>
  );
};

export default Registry;
