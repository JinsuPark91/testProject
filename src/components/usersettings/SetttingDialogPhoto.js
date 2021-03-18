import React, { useEffect, useState } from 'react';
import { useCoreStores } from 'teespace-core';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
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
  }, [userId, userStore]);

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

  const getDtoObject = photo => {
    const obj = {};
    obj.profilePhoto = photo;
    obj.backPhoto = userStore.getBackgroundPhotoURL(userStore.myProfile.id);
    obj.name = userStore.myProfile.name;
    obj.nick = userStore.myProfile.nick;
    obj.nationalCode = userStore.myProfile.nationalCode;
    obj.companyNum = userStore.myProfile.companyNum;
    obj.phone = userStore.myProfile.phone;
    obj.birthDate = userStore.myProfile.birthDate;
    return obj;
  };

  const handleChangePhoto = async file => {
    const fileURL = URL.createObjectURL(file);
    if (fileURL?.includes('blob:')) {
      const blobImage = await toBlob(fileURL);
      const base64Image = await toBase64(blobImage);
      const obj = getDtoObject(base64Image);
      await userStore.updateMyProfile(obj);
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
    const obj = getDtoObject(null);
    await userStore.updateMyProfile(obj);
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
          {t('CM_B2C_SETTING_CHANGE_INFO_22')}
        </StyledUpload>
      </Menu.Item>
      <Menu.Item onClick={handleChangeToDefaultPhoto} disabled={isDefaultPhoto}>
        {t('CM_EDIT_PROFILE_05')}
      </Menu.Item>
    </Menu>
  );

  return (
    <InnerItem>
      <Name>{t('CM_PHOTO')}</Name>
      <Data>
        <TextArea>
          <ImageBox>
            <img alt="profile" src={renderProfilePhoto} />
            <Dropdown
              trigger={['click']}
              placement="bottomLeft"
              overlay={profileMenu}
            >
              <ImageIcon />
            </Dropdown>
          </ImageBox>
          <Info>{t('CM_ADD_PHOTO_EXPLAIN')}</Info>
        </TextArea>
      </Data>
    </InnerItem>
  );
};

export default SettingDialogPhoto;
