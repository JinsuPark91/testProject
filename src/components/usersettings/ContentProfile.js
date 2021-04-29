import React from 'react';
import { useTranslation } from 'react-i18next';
import ContentTitle from './ContentTitle';
import {
  SettingDialogBirthDate,
  SettingDialogCompanyNum,
  SettingDialogCountryCode,
  SettingDialogName,
  SettingDialogNick,
  SettingDialogOrg,
  SettingDialogPhone,
  SettingDialogPhoto,
} from './profile';
import { isB2B } from '../../utils/GeneralUtil';
import { InnerList } from '../../styles/usersettings/SettingDialogStyle';

const ContentProfile = () => {
  const { t } = useTranslation();
  return (
    <>
      <ContentTitle
        title={t('CM_MY_INFO_06')}
        subTitle={t('CM_SPACE_EDIT_PROFILE_02')}
      />
      <InnerList>
        <SettingDialogPhoto />
        <SettingDialogName />
        <SettingDialogNick />
        {isB2B() && <SettingDialogOrg />}
        <SettingDialogCountryCode />
        {isB2B() && <SettingDialogCompanyNum />}
        <SettingDialogPhone />
        <SettingDialogBirthDate />
      </InnerList>
    </>
  );
};

export default ContentProfile;
