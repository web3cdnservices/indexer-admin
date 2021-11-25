// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import TelegramIcon from '../../resources/telegram.svg';
import DiscordIcon from '../../resources/discord.svg';
import GithubIcon from '../../resources/github.svg';
import LinkendinIcon from '../../resources/linkendin.svg';
import MediumIcon from '../../resources/medium.svg';
import MatrixIcon from '../../resources/matrix.svg';
import TwitterIcon from '../../resources/twitter.svg';

const createConfig = (src: string, url: string) => ({ src, url });

export const linkConfigs = [
  createConfig(TelegramIcon, 'https://t.me/subquerynetwork'),
  createConfig(DiscordIcon, 'https://www.linkedin.com/company/subquery'),
  createConfig(GithubIcon, 'https://github.com/subquery/subql'),
  createConfig(LinkendinIcon, 'https://www.linkedin.com/company/subquery'),
  createConfig(MediumIcon, 'https://subquery.medium.com/'),
  createConfig(MatrixIcon, 'https://matrix.to/#/#subquery:matrix.org'),
  createConfig(TwitterIcon, 'https://twitter.com/subquerynetwork'),
];