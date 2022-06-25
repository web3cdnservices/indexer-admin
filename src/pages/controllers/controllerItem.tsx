// Copyright 2020-2022 SubQuery Pte Ltd authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { FC } from 'react';
import { Tag } from '@subql/react-ui';
import { isUndefined } from 'lodash';

import { asyncRender } from 'components/asyncRender';
import Avatar from 'components/avatar';
import { Button, Text } from 'components/primary';
import { useBalance } from 'hooks/indexerHook';
import { openAccountExporer } from 'utils/account';

import { prompts } from './prompts';
import {
  AccountContainer,
  Balance,
  Buttons,
  ItemContainer,
  ItemContentContainer,
  Status,
} from './styles';
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
  const { active, activeBtn, widthdrawBtn, removeBtn } = prompts.controllerItem;
  const isActived = address === controller?.toLocaleLowerCase();
  const balance = useBalance(address);
  const emptyBalance = Number(balance) === 0;
  const account = { id, address };

  return (
    <ItemContainer>
      <ItemContentContainer onClick={() => openAccountExporer(address)}>
        <Avatar address={address} size={70} />
        <AccountContainer>
          <Text size={18} fw="600">
            {name}
          </Text>
          <Text size={15} color="gray" mt={5}>
            {address}
          </Text>
        </AccountContainer>
        <Balance>{asyncRender(!!balance, <Text>{`${balance} ACA`}</Text>)}</Balance>
        <Status>{isActived && <Tag text={active} state="success" />}</Status>
      </ItemContentContainer>
      {asyncRender(
        !isUndefined(controller) && !isUndefined(balance),
        <Buttons>
          {!isActived && <Button title={activeBtn} onClick={() => onConfigController(account)} />}
          {!isActived && emptyBalance && (
            <Button ml={10} title={removeBtn} onClick={() => onRemoveController(account)} />
          )}
          {!emptyBalance && (
            <Button ml={10} title={widthdrawBtn} onClick={() => onWithdraw(account)} />
          )}
        </Buttons>
      )}
    </ItemContainer>
  );
};

export default ControllerItem;
