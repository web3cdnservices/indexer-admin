// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useEffect, useState } from 'react';
import { browserName } from 'react-device-detect';

import { Button, Text } from 'components/primary';
import { useIsMetaMask, useIsMetaMaskInstalled, useWeb3 } from 'hooks/web3Hook';
// @ts-ignore
import MetaMaskIcon from 'resources/metamask.svg';
import { connectWithMetaMask, NetworkError, switchNetwork } from 'utils/metamask';

import { Image, ImageCard, Panel, Title } from '../login/styles';
import prompts from './prompts';

const MetaMaskView = () => {
  const { activate, error } = useWeb3();
  const isMetaMask = useIsMetaMask();
  const isMetaMaskInstalled = useIsMetaMaskInstalled();
  const [isEmpty, setIsEmpty] = useState(false);

  useEffect(() => {
    setIsEmpty(error?.name === NetworkError.unSupportedNetworkError);
  }, [error]);

  const getData = () => {
    const { install, connect, error } = prompts;
    if (!isMetaMaskInstalled) return install;
    if (isEmpty) return error;
    return connect;
  };

  const onButtonClick = () => {
    // TODO: handle `loading` status
    if (isEmpty) {
      switchNetwork();
      return;
    }
    if (isMetaMaskInstalled) {
      connectWithMetaMask(activate);
    } else {
      // @ts-ignore
      const url = extensionInstallUrls[browserName] ?? '';
      url && window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const data = getData();
  return !isMetaMask ? (
    <Panel>
      <Title align="center" weight="500">
        {data.title}
      </Title>
      {isEmpty && (
        <Text size={15} color="gray">
          {data.desc}
        </Text>
      )}
      <ImageCard>
        <Image src={MetaMaskIcon} />
      </ImageCard>
      <Button width={300} title={data.buttonTitle} onClick={onButtonClick} />
    </Panel>
  ) : null;
};

export default MetaMaskView;
