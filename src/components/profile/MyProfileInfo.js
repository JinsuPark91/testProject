import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { useCoreStores } from 'teespace-core';
import settingIcon from '../../assets/setting.svg';
import ProfileInfoModal from './ProfileInfoModal';
import ProfileEditModal from './ProfileEditModal';
import { useProfileContext } from './ProfileContextProvider';

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
    const getThumbPhoto = userStore.getUserProfilePhoto({
      userId: userId,
      size: 'small',
      isLocal: false,
      thumbPhoto: userStore.myProfile.thumbPhoto || null,
    });
    setThumbPhoto(`/${getThumbPhoto}`);
  }, [userStore.myProfile.lastUpdatedTime]);

  return (
    <>
      <ProfileIcon>
        <ThumbImage
          src={thumbPhoto}
          onLoad={revokeURL}
          onClick={handleInfoOpen}
        />
        <SettingImage>
          <img alt="settingIcon" src={settingIcon} />
        </SettingImage>
      </ProfileIcon>
      <ProfileInfoModal userId={userId} thumbPhoto={thumbPhoto} />
      <ProfileEditModal userId={userId} />
    </>
  );
}
const ProfileIcon = styled.div`
  display: flex;
  overflow: visible !important;
  align-items: flex-end;
  overflow: visible;
  display: flex;
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
  border-width: 0px;
  border-style: solid;
  margin-left: -0.63rem;
  text-align: left;
`;

export default MyProfileInfo;
