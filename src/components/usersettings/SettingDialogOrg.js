import React from 'react';
import { useCoreStores } from 'teespace-core';
import { Tooltip } from 'antd';
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
  const { authStore, userStore } = useCoreStores();
  const isAdmin = userStore.myProfile.grade === 'admin';
  const tooltipText = '어드민만 변경 가능';

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
          {/* {isAdmin ? (
            <LockIconBox>
              <LockLineIcon width="0.88" height="0.88" />
            </LockIconBox>
          ) : (
            <Tooltip title={tooltipText} placement="bottomLeft">
              <LockIconBox>
                <LockLineIcon width="0.88" height="0.88" />
              </LockIconBox>
            </Tooltip>
          )} */}
        </ButtonArea>
      </Data>
    </InnerItem>
  );
};

export default SettingDialogOrg;
