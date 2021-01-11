import React, { useEffect, useState } from 'react';
import { useCoreStores } from 'teespace-core';
import { Menu, Dropdown } from 'antd';
import {
  InnerItem,
  Name,
  Data,
  TextArea,
  ImageBox,
  ImageIcon,
  Info,
  StyledUpload,
} from '../../styles/SettingDialogStyle';

const SettingDialogPhoto = () => {
  const { userStore } = useCoreStores();
  const userId = userStore.myProfile.id;
  const profile = userStore.userProfiles[userId];

  useEffect(() => {
    (async () => {
      let userProfile = userStore.userProfiles[userId];
      if (!userProfile) {
        userProfile = await userStore.getProfile({ userId });
      }
    })();
  }, []);

  const [profilePhoto, setProfilePhoto] = useState(undefined);

  const toBase64 = async blobImage =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(blobImage);
      reader.onload = () => resolve(reader.result);
      reader.onerror = err => reject(err);
    });

  const toBlob = async file => {
    const result = await fetch(file).then(r => r.blob());
    return result;
  };

  const handleChangePhoto = async file => {
    const fileURL = URL.createObjectURL(file);
    if (fileURL?.includes('blob:')) {
      const blobImage = await toBlob(fileURL);
      const base64Image = await toBase64(blobImage);
      const updatedInfo = {};
      updatedInfo.profilePhoto = base64Image;
      await userStore.updateMyProfile({ updatedInfo });
      URL.revokeObjectURL(fileURL);
    }
    // initialize
    setProfilePhoto(undefined);
  };

  const getProfilePhoto = () => {
    return userStore.getProfilePhotoURL(userId, 'medium');
  };

  const renderProfilePhoto =
    profilePhoto === null
      ? profile.defaultPhotoUrl
      : profilePhoto || getProfilePhoto();

  const handleChangeToDefaultPhoto = async () => {
    const updatedInfo = {};
    updatedInfo.profilePhoto = null;
    await userStore.updateMyProfile({ updatedInfo });
  };

  const isDefaultPhoto = profilePhoto === undefined && !profile?.thumbPhoto;

  const profileMenu = (
    <Menu>
      <Menu.Item>
        <StyledUpload
          component="div"
          multiple={false}
          accept={['.jpg,.jpeg,.png']}
          customRequest={({ file }) => handleChangePhoto(file)}
        >
          프로필 사진 변경
        </StyledUpload>
      </Menu.Item>
      <Menu.Item onClick={handleChangeToDefaultPhoto} disabled={isDefaultPhoto}>
        기본 이미지로 변경
      </Menu.Item>
    </Menu>
  );

  return (
    <InnerItem>
      <Name>사진</Name>
      <Data>
        <TextArea>
          <Dropdown
            trigger={['click']}
            placement="bottomLeft"
            overlay={profileMenu}
          >
            <ImageBox>
              <img alt="profile" src={renderProfilePhoto} />
              <ImageIcon />
            </ImageBox>
          </Dropdown>
          <Info>사진을 추가하여 스페이스 별로 설정할 수 있습니다.</Info>
        </TextArea>
      </Data>
    </InnerItem>
  );
};

export default SettingDialogPhoto;
