import { observer } from 'mobx-react';
import React, { useState } from 'react';
import { useCoreStores } from 'teespace-core';
import { useTranslation } from 'react-i18next';
import { Menu, Dropdown } from 'antd';
import { getProfileEditDto } from '../../../utils/ProfileUtil';
import {
  InnerItem,
  Name,
  Data,
  TextArea,
  ImageBox,
  ImageIcon,
  Info,
  StyledUpload,
} from '../../../styles/usersettings/SettingDialogStyle';

const SettingDialogPhoto = observer(() => {
  const { t } = useTranslation();
  const { userStore } = useCoreStores();
  const myUserId = userStore.myProfile.id;
  const profile = userStore.userProfiles[myUserId];
  const [isDisabled, setIsDisabled] = useState(!profile.thumbPhoto);

  const getProfilePhoto = () => {
    return userStore.getProfilePhotoURL(myUserId, 'medium');
  };

  const handleChangePhoto = async file => {
    const updatedInfo = getProfileEditDto({
      thumbFile: file,
    });
    await userStore.updateMyProfile({ updatedInfo });
    setIsDisabled(false);
  };
  const handleChangeToDefaultPhoto = async () => {
    const updatedInfo = getProfileEditDto({
      thumbFile: null,
    });
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
            <img alt="profile" src={getProfilePhoto()} />
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
