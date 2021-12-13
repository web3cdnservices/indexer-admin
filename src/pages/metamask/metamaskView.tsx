// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useCallback, useEffect, useState } from 'react';
import { browserName } from 'react-device-detect';

import Icon from 'components/Icon';
import { Button, Label, Text } from 'components/primary';
import { useIsMetaMask, useIsMetaMaskInstalled, useWeb3 } from 'hooks/web3Hook';
// @ts-ignore
import MetaMaskIcon from 'resources/metamask.svg';
import { connectWithMetaMask, NetworkError, switchNetwork } from 'utils/metamask';

import { extensionInstallUrls } from './config';
import prompts from './prompts';
import { Container, ContentContainer, MetaMaskContainer } from './styles';

const MetaMaskView = () => {
  const { activate, error } = useWeb3();
  const isMetaMask = useIsMetaMask();
  const isMetaMaskInstalled = useIsMetaMaskInstalled();
  const [isNetworkError, setNetworkError] = useState(false);

  useEffect(() => {
    setNetworkError(error?.name === NetworkError.unSupportedNetworkError);
  }, [error]);

  const getData = useCallback(() => {
    const { install, connect, error } = prompts;
    if (!isMetaMaskInstalled) return install;
    if (isNetworkError) return error;
    return connect;
  }, [isNetworkError, isMetaMaskInstalled]);

  const onButtonClick = useCallback(() => {
    if (isNetworkError) {
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
  }, [isNetworkError, isMetaMaskInstalled]);

  const renderMetaMaskItem = () => (
    <MetaMaskContainer>
      <div>
        <ContentContainer>
          <Icon size={50} src={MetaMaskIcon} />
          <Label ml={20} size={25}>
            MetaMask
          </Label>
        </ContentContainer>
        <Text mt={10}>Connect with MetaMask browser extension</Text>
      </div>
      <i className="bi-arrow-right" role="img" aria-label="arrow right" />
    </MetaMaskContainer>
  );

  const data = getData();
  return !isMetaMask ? (
    <Container>
      <Label size={35} fw="400">
        {data.title}
      </Label>
      <Text mt={15}>{data.desc}</Text>
      <Button
        mt={50}
        type="secondary"
        title=""
        onClick={() => onButtonClick()}
        leftItem={renderMetaMaskItem()}
      />
    </Container>
  ) : null;
};

export default MetaMaskView;
