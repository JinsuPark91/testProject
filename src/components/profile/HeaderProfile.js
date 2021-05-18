import React, { useState, useCallback } from 'react';
import { useCoreStores, Tooltip } from 'teespace-core';
import { observer } from 'mobx-react';
import { useTranslation } from 'react-i18next';
import ProfileMyModal from './ProfileMyModal';
import {
  ProfileIcon,
  NewBadge,
  ThumbImage,
  SettingImage,
} from '../../styles/profile/HeaderProfileStyle';
import settingIcon from '../../assets/setting.svg';

const HeaderProfile = observer(() => {
  const { t } = useTranslation();
  const { userStore, authStore, spaceStore } = useCoreStores();
  const myUserId = userStore.myProfile.id;
  const { isFirstLogin } = authStore.sessionInfo;
  const [myModalVisible, setMyModalVisible] = useState(isFirstLogin);
  const [tutorialVisible, setTutorialVisible] = useState(isFirstLogin);

  const spaceUnreadCount =
    spaceStore.totalUnreadSpaceCount -
    spaceStore.currentSpace?.totalUnreadRoomCount;

  const thumbPhoto = userStore.getProfilePhotoURL(myUserId, 'small');

  const toggleMyModal = useCallback(() => {
    setMyModalVisible(v => !v);
    if (tutorialVisible) setTutorialVisible(false);
  }, [tutorialVisible]);

  return (
    <>
      <Tooltip
        placement="bottomLeft"
        title={t('CM_ROOMTITLE_TOOLTIP_04')}
        color="#4C535D"
      >
        <ProfileIcon className="header__profile-button" onClick={toggleMyModal}>
          {spaceUnreadCount > 0 && <NewBadge />}
          <ThumbImage src={thumbPhoto} />
          <SettingImage>
            <img alt="settingIcon" src={settingIcon} />
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
