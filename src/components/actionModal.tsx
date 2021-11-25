// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';
import { Modal } from 'antd';
import { FC } from 'react';

// FIXME: fix modal styles  `border-radius`, position
const StyledModal = styled(Modal)`
  display: flex;
  align-self: center;
`;

const Container = styled.div`
  display: flex;
  min-width: 600px;
  min-height: 400px;
`;

type Props = {
  visible: boolean;
  onClose: () => void;
};

// TOOD: create a global modal, using context
const ActionModal: FC<Props> = ({ visible, onClose, children }) => {
  return (
    <StyledModal footer={null} visible={visible} title="Developement" onCancel={onClose}>
      <Container>{children}</Container>
    </StyledModal>
  );
};

export default ActionModal;
