import React, { useState } from 'react';
import { useCoreStores, Menu, Dropdown } from 'teespace-core';
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
  const { spaceStore } = useCoreStores();
  const [isDisabled, setDisabled] = useState(!groupPhoto);

  const [isVisible, setIsVisible] = useState(false);

  const handleChangePhoto = file => {
    setDisabled(false);
    handleChange(file);
  };

  const handleChangeToDefaultPhoto = () => {
    setDisabled(true);
    handleChange(null);
  };

  const handleVisibleChange = flag => {
    if (flag !== isVisible) setIsVisible(flag);
  };

  // TODO: dropdown 자동으로 닫히지 않는 이슈 분석
  const imageChangeMenu = (
    <Menu onClick={() => setIsVisible(false)}>
      <Menu.Item>
        <StyledUpload
          component="div"
          accept={['.jpg,.jpeg,.png']}
          multiple={false}
          customRequest={({ file }) => handleChangePhoto(file)}
        >
          {t('CM_PROFILE_EDIT_CHANGE_IMAGE')}
        </StyledUpload>
      </Menu.Item>
      <Menu.Item onClick={handleChangeToDefaultPhoto} disabled={isDisabled}>
        {t('CM_EDIT_PROFILE_05')}
      </Menu.Item>
    </Menu>
  );

  return (
    <>
      <SpaceImage>
        {groupPhoto ? (
          <img alt="groupImg" src={groupPhoto} />
        ) : (
          <span>{spaceStore.currentSpace?.name[0]}</span>
        )}
        <ImageChangeBox>
          <Dropdown
            trigger={['click']}
            overlay={imageChangeMenu}
            placement="bottomLeft"
            visible={isVisible}
            onVisibleChange={handleVisibleChange}
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
