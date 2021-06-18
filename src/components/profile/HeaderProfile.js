import React, { useState, useCallback, useContext } from 'react';
import { useCoreStores, Tooltip } from 'teespace-core';
import { observer } from 'mobx-react';
import { useTranslation } from 'react-i18next';
import { ThemeContext } from 'styled-components';
import ProfileMyModal from './ProfileMyModal';
import {
  ProfileIcon,
  ThumbImage,
  SettingImage,
} from '../../styles/profile/HeaderProfileStyle';
import { SettingIcon } from '../Icons';

const HeaderProfile = observer(() => {
  const { t } = useTranslation();
  const { userStore, authStore } = useCoreStores();
  const myUserId = userStore.myProfile.id;
  const { isFirstLogin } = authStore.sessionInfo;
  const [myModalVisible, setMyModalVisible] = useState(isFirstLogin);
  const [tutorialVisible, setTutorialVisible] = useState(isFirstLogin);

  const thumbPhoto = userStore.getProfilePhotoURL(myUserId, 'small');

  const toggleMyModal = useCallback(() => {
    setMyModalVisible(v => !v);
    if (tutorialVisible) setTutorialVisible(false);
  }, [tutorialVisible]);
  const themeContext = useContext(ThemeContext);
  return (
    <>
      <Tooltip
        placement="bottomLeft"
        title={t('CM_ROOMTITLE_TOOLTIP_04')}
        color={themeContext.CoreLight}
      >
        <ProfileIcon className="header__profile-button" onClick={toggleMyModal}>
          <ThumbImage src={thumbPhoto} />
          <SettingImage>
            <SettingIcon
              width={0.875}
              height={0.875}
              color={themeContext.HeaderIcon}
            />
          </SettingImage>
        </ProfileIcon>
      </Tooltip>
      <ProfileMyModal
        visible={myModalVisible}
        onCancel={toggleMyModal}
        created={tutorialVisible}
      />
    </>
  );
});

export default HeaderProfile;
