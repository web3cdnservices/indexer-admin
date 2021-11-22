// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { browserName } from 'react-device-detect';
import { Panel, Title, ImageCard, Image, StyledButton } from './styles';
import MetaMaskIcon from '../../resources/metamask.svg';
import { useIsMetaMaskInstalled, useWeb3 } from '../../hooks/web3Hook';
import { connectWithMetaMask } from '../../utils/metamask';

// TODO: move to the single json file
const data = {
  install: {
    title: 'No MetaMask Extension found in the browser',
    buttonText: 'Install MetaMask Extension',
  },
  connect: {
    title: 'Connect wallet to use Indexer Admin',
    buttonText: 'Connect with MetaMask',
  },
};

// TODO: move to a constant file
const extensionUrls = {
  Chrome: 'https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn',
  Firefox: 'https://addons.mozilla.org/en-US/firefox/addon/ether-metamask/',
  Brave: 'https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn',
  Edge: 'https://microsoftedge.microsoft.com/addons/detail/metamask/ejbalbakoplchlghecdalmeeeajnimhm',
};

const MetaMaskView = () => {
  const { activate } = useWeb3();
  const isMetaMaskInstalled = useIsMetaMaskInstalled();
  const desc = isMetaMaskInstalled ? data.connect : data.install;

  const onButtonClick = () => {
    if (isMetaMaskInstalled) {
      connectWithMetaMask(activate);
    } else {
      // @ts-ignore
      const url = extensionUrls[browserName] ?? '';
      url && window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <Panel>
      <Title align="center" weight="500">
        {desc.title}
      </Title>
      <ImageCard>
        <Image src={MetaMaskIcon} />
      </ImageCard>
      <StyledButton type="primary" shape="round" size="large" onClick={onButtonClick}>
        {desc.buttonText}
      </StyledButton>
    </Panel>
  );
};

export default MetaMaskView;
