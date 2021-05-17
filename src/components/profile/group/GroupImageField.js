import React from 'react';
import { Menu, Dropdown } from 'teespace-core';
import { useTranslation } from 'react-i18next';
import {
  SpaceImage,
  ImageChangeBox,
  ImageChangButton,
  Blind,
  StyledUpload,
} from '../../../styles/profile/SpaceEditModalStyle';
import { CameraIcon } from '../../Icons';

const GroupImageField = ({ groupPhoto, handleChange }) => {
  const { t } = useTranslation();
  const imageChangeMenu = (
    <Menu>
      <Menu.Item>
        <StyledUpload
          component="div"
          accept={['.jpg,.jpeg,.png']}
          multiple={false}
          customRequest={({ file }) => handleChange(file)}
        >
          {t('CM_PROFILE_EDIT_CHANGE_IMAGE')}
        </StyledUpload>
      </Menu.Item>
      <Menu.Item onClick={() => handleChange(undefined)}>
        {t('CM_EDIT_PROFILE_05')}
      </Menu.Item>
    </Menu>
  );

  return (
    <>
      <SpaceImage>
        <img alt="groupImg" src={groupPhoto} />
        <ImageChangeBox>
          <Dropdown
            trigger={['click']}
            overlay={imageChangeMenu}
            placement="bottomLeft"
          >
            <ImageChangButton>
              <Blind>Change Profile Image</Blind>
              <CameraIcon width={1.88} height={1.88} />
            </ImageChangButton>
          </Dropdown>
        </ImageChangeBox>
      </SpaceImage>
    </>
  );
};

export default React.memo(GroupImageField);
