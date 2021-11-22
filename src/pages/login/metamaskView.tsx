// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { browserName } from 'react-device-detect';
import { Panel, Title, ImageCard, Image, StyledButton } from './styles';
import MetaMaskIcon from '../../resources/metamask.svg';
import { useIsMetaMaskInstalled, useWeb3 } from '../../hooks/web3Hook';
import { connectWithMetaMask } from '../../utils/metamask';
import prompts from './prompts';

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
  const { metamask } = prompts;
  const data = isMetaMaskInstalled ? metamask.connect : metamask.install;

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
        {data.title}
      </Title>
      <ImageCard>
        <Image src={MetaMaskIcon} />
      </ImageCard>
      <StyledButton type="primary" shape="round" size="large" onClick={onButtonClick}>
        {data.buttonTitle}
      </StyledButton>
    </Panel>
  );
};

export default MetaMaskView;
