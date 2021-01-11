import React from 'react';
import { useCoreStores } from 'teespace-core';
import {
  InnerItem,
  Name,
  Data,
  TextArea,
  ButtonArea,
  LockIconBox,
} from '../../styles/SettingDialogStyle';
import { LockLineIcon } from '../Icons';

const SettingDialogOrg = () => {
  const { authStore } = useCoreStores();

  return (
    <InnerItem>
      <Name>부서/ 직책/ 직위</Name>
      <Data>
        <TextArea>
          <p>
            {authStore.user.orgName || '-'}/ {authStore.user.position || '-'}/{' '}
            {authStore.user.departmentName || '-'}
          </p>
        </TextArea>
        <ButtonArea>
          <LockIconBox>
            <LockLineIcon width="0.88" height="0.88" />
          </LockIconBox>
        </ButtonArea>
      </Data>
    </InnerItem>
  );
};

export default SettingDialogOrg;
