// Copyright 2020-2022 SubQuery Pte Ltd authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useState, VFC } from 'react';
import Modal from 'react-modal';
import styled from 'styled-components';

import { Button, Text } from './primary';

type Props = {
  visible: boolean;
  title?: string;
  description?: string;
};

const AlertView: VFC<Props> = ({ visible = false, title, description }) => {
  const [isOpen, setIsOpen] = useState(visible);
  return (
    <Modal isOpen={isOpen} style={modalStyles} closeTimeoutMS={200} ariaHideApp={false}>
      <Container>
        <ContentContainer>
          <Text fw="bold" size={35}>
            {title}
          </Text>
          <Text alignCenter fw="400" mt={30} size={18}>
            {description}
          </Text>
        </ContentContainer>
        <Button mt={100} width={300} title="Confirm" onClick={() => setIsOpen(false)} />
      </Container>
    </Modal>
  );
};

export default AlertView;

const modalStyles = {
  content: {
    backgroundColor: 'white',
    borderRadius: 15,
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    maxWidth: 900,
    minWidth: 700,
    padding: 0,
  },
  overlay: {
    zIndex: 50,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
  },
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 50px 30px;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
