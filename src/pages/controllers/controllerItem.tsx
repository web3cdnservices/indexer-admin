// Copyright 2020-2022 SubQuery Pte Ltd authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { FC } from 'react';
import { Tag } from '@subql/react-ui';

import { asyncRender } from 'components/asyncRender';
import { Button, Text } from 'components/primary';
import { useBalance } from 'hooks/indexerHook';

import { AccountContainer, Balance, Buttons, ItemContainer, Status } from './styles';
import { Controller } from './types';

type Props = {
  name: string;
  controller: string | undefined;
  onConfigController: (controller: Controller) => void;
  onRemoveController: (controller: Controller) => void;
  onWithdraw: (controller: Controller) => void;
} & Controller;

const ControllerItem: FC<Props> = ({
  id,
  name,
  controller,
  address,
  onConfigController,
  onRemoveController,
  onWithdraw,
}) => {
  const isActived = address === controller?.toLocaleLowerCase();
  const balance = useBalance(address);
  const emptyBalance = Number(balance) === 0;
  const account = { id, address };

  return (
    <ItemContainer>
      <AccountContainer>
        <Text>{name}</Text>
        <Text mt={5}>{address}</Text>
      </AccountContainer>
      <Balance>{asyncRender(!!balance, <Text>{`${balance} ACA`}</Text>)}</Balance>
      <Status>{isActived && <Tag text="Actived" state="success" />}</Status>
      <Buttons>
        {!isActived && <Button title="Configure" onClick={() => onConfigController(account)} />}
        {emptyBalance ? (
          <Button ml={10} title="Remove" onClick={() => onRemoveController(account)} />
        ) : (
          <Button ml={10} title="Withdraw" onClick={() => onWithdraw(account)} />
        )}
      </Buttons>
    </ItemContainer>
  );
};

export default ControllerItem;
