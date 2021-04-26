import React, { useState, useCallback } from 'react';
import { useCoreStores } from 'teespace-core';
import { observer } from 'mobx-react';
import ProfileMyModal from './ProfileMyModal';
import {
  ProfileIcon,
  NewBadge,
  ThumbImage,
  SettingImage,
} from '../../styles/profile/HeaderProfileStyle';
import settingIcon from '../../assets/setting.svg';

const HeaderProfile = observer(() => {
  const { userStore, authStore, spaceStore } = useCoreStores();
  const myUserId = userStore.myProfile.id;
  const { isFirstLogin } = authStore.sessionInfo;
  const [myModalVisible, setMyModalVisible] = useState(isFirstLogin);
  const [tutorialVisible, setTutorialVisible] = useState(isFirstLogin);

  const spaceUnreadCount =
    spaceStore.totalUnreadSpaceCount -
    spaceStore.currentSpace?.totalUnreadRoomCount;

  const thumbPhoto = userStore.getProfilePhotoURL(myUserId, 'small');
  const thumbPhotoMedium = userStore.getProfilePhotoURL(myUserId, 'medium');

  const toggleMyModal = useCallback(() => {
    setMyModalVisible(v => !v);
    if (tutorialVisible) setTutorialVisible(false);
  }, [tutorialVisible]);

  return (
    <>
      <ProfileIcon onClick={toggleMyModal}>
        {spaceUnreadCount > 0 && <NewBadge />}
        <ThumbImage src={thumbPhoto} />
        <SettingImage>
          <img alt="settingIcon" src={settingIcon} />
        </SettingImage>
      </ProfileIcon>
      {myModalVisible && (
        <ProfileMyModal
          userId={myUserId}
          onCancel={toggleMyModal}
          visible={myModalVisible}
          thumbPhoto={thumbPhotoMedium}
          created={tutorialVisible}
        />
      )}
    </>
  );
});

export default HeaderProfile;
