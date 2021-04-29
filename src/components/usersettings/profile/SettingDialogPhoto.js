import { observer } from 'mobx-react';
import React, { useState } from 'react';
import { useCoreStores } from 'teespace-core';
import { useTranslation } from 'react-i18next';
import { Menu, Dropdown } from 'antd';
import { updateMyProfile } from '../../../utils/ProfileUtil';
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
  const { myProfile } = userStore;
  const myUserId = myProfile.id;
  const [isDisabled, setIsDisabled] = useState(!myProfile.thumbPhoto);

  const getProfilePhoto = () => {
    return userStore.getProfilePhotoURL(myUserId, 'medium');
  };

  const handleChangePhoto = async file => {
    await updateMyProfile({
      thumbFile: file,
    });
    setIsDisabled(false);
  };
  const handleChangeToDefaultPhoto = async () => {
    await updateMyProfile({
      thumbFile: null,
    });
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

export default React.memo(SettingDialogPhoto);
