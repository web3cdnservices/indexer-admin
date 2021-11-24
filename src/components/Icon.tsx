// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { FC } from 'react';

type Props = {
  src: string;
  url?: string;
};

const Icon: FC<Props> = ({ src, url }) =>
  url ? (
    <a href={url}>
      <img src={src} alt={url} />
    </a>
  ) : (
    <img src={src} alt={src} />
  );

export default Icon;
