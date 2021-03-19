import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
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

const SettingDialogPhoto = observer(() => {
  const { t } = useTranslation();
  const { userStore } = useCoreStores();
  const userId = userStore.myProfile.id;
  const profile = userStore.userProfiles[userId];
  const [isDisabled, setIsDisabled] = useState(!profile.thumbPhoto);

  useEffect(() => {
    (async () => {
      let userProfile = userStore.userProfiles[userId];
      if (!userProfile) {
        userProfile = await userStore.getProfile({ userId });
      }
    })();
  }, [userId, userStore]);

  const getDtoObject = () => {
    const obj = {};
    obj.profilePhoto = null;
    obj.backPhoto = userStore.getBackgroundPhotoURL(userStore.myProfile.id);
    obj.backFile = null;
    obj.backName = null;
    obj.name = userStore.myProfile.name;
    obj.nick = userStore.myProfile.nick;
    obj.nationalCode = userStore.myProfile.nationalCode;
    obj.companyNum = userStore.myProfile.companyNum;
    obj.phone = userStore.myProfile.phone;
    obj.birthDate = userStore.myProfile.birthDate;

    return obj;
  };

  const handleChangePhoto = async file => {
    const updatedInfo = getDtoObject();
    updatedInfo.profileFile = file;
    updatedInfo.profileName = file?.name;
    await userStore.updateMyProfile({ updatedInfo });
    setIsDisabled(false);
  };

  const getProfilePhoto = () => {
    return userStore.getProfilePhotoURL(userId, 'medium');
  };
  const renderProfilePhoto = getProfilePhoto();

  const handleChangeToDefaultPhoto = async () => {
    const updatedInfo = getDtoObject();
    updatedInfo.profileFile = null;
    updatedInfo.profileName = null;
    await userStore.updateMyProfile({ updatedInfo });
    setIsDisabled(true);
  };

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
      <Menu.Item onClick={handleChangeToDefaultPhoto} disabled={isDisabled}>
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
});

export default SettingDialogPhoto;
