import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { useCoreStores } from 'teespace-core';
import settingIcon from '../../assets/setting.svg';
import ProfileInfoModal from './ProfileInfoModal';
import ProfileEditModal from './ProfileEditModal';
import { useProfileContext } from './ProfileContextProvider';

const IS_LOCAL = true;

function MyProfileInfo() {
  const [thumbPhoto, setThumbPhoto] = useState(null);
  const { userStore, authStore } = useCoreStores();
  const userId = authStore.user.id;
  const useProfile = useProfileContext();

  const handleInfoOpen = useCallback(() => {
    useProfile.setState({ ...useProfile.state, infoMode: true });
  }, [useProfile]);

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
        <ThumbImage
          src={userStore.getProfilePhotoURL(userStore.myProfile.id, 'small')}
          onLoad={revokeURL}
          onClick={handleInfoOpen}
        />
        <SettingImage>
          <img alt="settingIcon" src={settingIcon} />
        </SettingImage>
      </ProfileIcon>
      <ProfileInfoModal
        userId={userId}
        thumbPhoto={userStore.getProfilePhotoURL(
          userStore.myProfile.id,
          'small',
        )}
      />
      <ProfileEditModal userId={userId} />
    </>
  );
}
const ProfileIcon = styled.div`
  overflow: visible !important;
  display: flex;
  align-items: flex-end;
`;
const ThumbImage = styled.img`
  border-radius: 50%;
  cursor: pointer;
  width: 30px;
  height: 30px;
  border: 1px solid rgba(0, 0, 0, 0.05);
`;
const SettingImage = styled.div`
  width: 0.8rem;
  height: 0.8rem;
  margin-left: -0.63rem;
`;

export default MyProfileInfo;
