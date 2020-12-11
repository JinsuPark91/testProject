import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { Observer } from 'mobx-react';
import { useCoreStores } from 'teespace-core';
import settingIcon from '../../assets/setting.svg';
import ProfileMyModal from './ProfileMyModal';

const IS_LOCAL = true;

// const [infoModalVisible, setInfoModalVisible] = useState(false);
// const [editModalVisible, setEditModalVisible] = useState(false);

// const handleInfoOpen = useCallback(() => {
//   setInfoModalVisible(true);
// }, []);

// const handleInfoClose = useCallback(() => {
//   setInfoModalVisible(false);
// }, []);

// const handleClickEditProfile = useCallback(() => {
//   setEditModalVisible(true);
// }, []);

// const handleEditClose = useCallback(() => {
//   setEditModalVisible(false);

//   <ProfileInfoModal
//   visible={infoModalVisible}
//   userId={userId}
//   thumbPhoto={userStore.getProfilePhotoURL(
//     userStore.myProfile.id,
//     'small',
//   )}
//   onClose={handleInfoClose}
//   onClickEditProfile={handleClickEditProfile}
// />
// <ProfileEditModal
//   visible={editModalVisible}
//   userId={userId}
//   onClose={handleEditClose}
// />

function MyProfileInfo() {
  const [thumbPhoto, setThumbPhoto] = useState(null);
  const [myModalVisible, setMyModalVisible] = useState(false);
  const { userStore, authStore } = useCoreStores();
  const userId = authStore.user.id;

  const toggleMyModal = useCallback(() => {
    setMyModalVisible(v => !v);
  }, []);

  const revokeURL = useCallback(() => {
    URL.revokeObjectURL(thumbPhoto);
  }, [thumbPhoto]);

  useEffect(() => {
    const getThumbPhoto = userStore.getProfilePhotoURL(userId, 'small');
    setThumbPhoto(`${getThumbPhoto}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userStore.myProfile.lastUpdatedTime]);

  return (
    <>
      <ProfileIcon>
        <Observer>
          {() => (
            <ThumbImage
              src={userStore.getProfilePhotoURL(
                userStore.myProfile.id,
                'small',
              )}
              onLoad={revokeURL}
              onClick={toggleMyModal}
            />
          )}
        </Observer>
        <SettingImage>
          <img alt="settingIcon" src={settingIcon} />
        </SettingImage>
      </ProfileIcon>
      <ProfileMyModal
        userId={userId}
        onCancel={toggleMyModal}
        visible={myModalVisible}
        thumbPhoto={thumbPhoto}
        created={false}
      />
      )}
    </>
  );
}
const ProfileIcon = styled.div`
  position: relative;
`;
const ThumbImage = styled.img`
  width: 1.88rem;
  height: 1.88rem;
  border-radius: 50%;
  cursor: pointer;
  border: 1px solid rgba(0, 0, 0, 0.05);
`;
const SettingImage = styled.div`
  position: absolute;
  right: -0.125rem;
  bottom: -0.125rem;
  line-height: 0;
  width: 0.9375rem;
  height: 0.9375rem;
`;

export default MyProfileInfo;
