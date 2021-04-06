import React from 'react';
import { useCoreStores } from 'teespace-core';
import { useTranslation } from 'react-i18next';
import { Tooltip } from 'antd';
import {
  InnerItem,
  Name,
  Data,
  TextArea,
  ButtonArea,
  LockIconBox,
} from '../../../styles/usersettings/SettingDialogStyle';
import { LockLineIcon } from '../../Icons';

const SettingDialogOrg = () => {
  const { t } = useTranslation();
  const { userStore } = useCoreStores();
  const { myProfile } = userStore;
  // const tooltipText = '어드민만 변경 가능';

  return (
    <InnerItem>
      <Name>{t('CM_SETTING_CHANGE_INFO_COMPANY_04')}</Name>
      <Data>
        <TextArea>
          <p>
            {myProfile.orgName || '-'}/ {myProfile.position || '-'}/{' '}
            {myProfile.job || '-'}
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
            <Tooltip title={tooltipText} placement="bottom" color="#4C535D">
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
