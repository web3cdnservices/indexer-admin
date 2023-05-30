// Copyright 2020-2022 SubQuery Pte Ltd authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { FC, useEffect, useState } from 'react';
import { Button } from '@subql/components';
import { Modal } from 'antd';
import styled from 'styled-components';

import { ButtonContainer, Text } from './primary';

type Props = {
  visible: boolean;
  title?: string;
  description?: string;
};

const AlertView: FC<Props> = ({ visible = false, title, description }) => {
  const [isOpen, setIsOpen] = useState(visible);
  const [loading, setLoading] = useState(false);

  const handleOk = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setIsOpen(false);
    }, 3000);
  };

  const handleCancel = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    setIsOpen(visible);
  }, [visible]);

  return (
    <Modal open={isOpen} width="40%" onCancel={handleCancel} footer={null}>
      <ContentContainer>
        <DescContainer>
          <Text alignCenter fw="500" mt={20} size={25}>
            {title}
          </Text>
          <Text alignCenter mt={20} size={15} color="gray">
            {description}
          </Text>
        </DescContainer>
        <ButtonContainer align="right" mt={30}>
          <Button label="Confirm" type="secondary" onClick={handleOk} loading={loading} />
        </ButtonContainer>
      </ContentContainer>
    </Modal>
  );
};

export default AlertView;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
`;

const DescContainer = styled.div`
  display: flex;
  padding: 10px;
  flex-direction: column;
  align-items: center;
`;
