// Copyright 2020-2022 SubQuery Pte Ltd authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useState, VFC } from 'react';
import { Modal } from 'antd';

import { Button, Text } from './primary';

type Props = {
  visible: boolean;
  title?: string;
  description?: string;
};

const AlertView: VFC<Props> = ({ visible = false, title, description }) => {
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
  return (
    <Modal open={isOpen} title="Title" onOk={handleOk} onCancel={handleCancel}>
      <Text fw="bold" size={35}>
        {title}
      </Text>
      <Text alignCenter fw="400" mt={30} size={18}>
        {description}
      </Text>
      <Button mt={100} width={300} title="Confirm" loading={loading} onClick={handleOk} />
    </Modal>
  );
};

export default AlertView;
