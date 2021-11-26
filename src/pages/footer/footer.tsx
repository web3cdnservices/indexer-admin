// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useLocation } from 'react-router-dom';
import { Container, ContentContainer, IconsContainer } from './styles';
import { linkConfigs } from './config';
import Icon from '../../components/Icon';
import { Text } from '../../components/primary';

const Header = () => {
  const location = useLocation();
  if (['/project', '/projects', '/account'].includes(location.pathname)) return null;

  return (
    <Container>
      <ContentContainer>
        <Text mw={160} color="white" fw="700" size={30}>
          Follow Us
        </Text>
        <IconsContainer>
          {linkConfigs.map(({ src, url }) => (
            <Icon src={src} url={url} />
          ))}
        </IconsContainer>
      </ContentContainer>
      <Text ml={80} mt={5} color="white" fw="400" size={10}>
        SubQuery © 2021
      </Text>
    </Container>
  );
};

export default Header;
