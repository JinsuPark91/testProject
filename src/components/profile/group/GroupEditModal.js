import React, { useState, useCallback } from 'react';
import { Message, useCoreStores } from 'teespace-core';
import { Button } from 'antd';
import { useTranslation } from 'react-i18next';
import GroupNameField from './GroupNameField';
import GroupUrlField from './GroupUrlField';
import GroupImageField from './GroupImageField';
import {
  handleCheckValidUrl,
  handleCheckValidEngUrl,
} from '../../../libs/Regex';
import { Wrapper } from '../../../styles/profile/SpaceEditModalStyle';

const GroupEditModal = ({ onClose, onSuccess }) => {
  const { t } = useTranslation();
  const { userStore, spaceStore } = useCoreStores();
  const { currentSpace } = spaceStore;

  const getCurrentSpaceAddress = () => {
    return (
      currentSpace?.domain?.slice(0, currentSpace?.domain?.indexOf('.')) || ''
    );
  };
  const [groupPhoto, setGroupPhoto] = useState(undefined);

  const [newSpaceName, setNewSpaceName] = useState(currentSpace?.name || '');
  const [newAddress, setNewAddress] = useState(getCurrentSpaceAddress());

  const [isUrlWarningVisible, setIsUrlWarningVisible] = useState(false);
  const [urlWarningText, setUrlWarningText] = useState('');

  const [isWarningPopupVisible, setIsWarningPopupVisible] = useState(false);

  const handleChangeCheck = () => {
    return (
      newSpaceName === currentSpace?.name &&
      newAddress === getCurrentSpaceAddress()
    );
  };
  const handleCheckDisable = () => {
    return handleChangeCheck() || !(newSpaceName && newAddress.length >= 3);
  };

  const handleChangePhoto = useCallback(file => {
    if (file) setGroupPhoto(URL.createObjectURL(file));
    else setGroupPhoto(undefined);
  }, []);

  const handleChangeName = useCallback(value => {
    setNewSpaceName(value);
  }, []);

  const handleChangeUrl = useCallback(
    event => {
      const targetText = event.target.value;
      setNewAddress(targetText.toLowerCase());
      if (isUrlWarningVisible) setIsUrlWarningVisible(false);
    },
    [isUrlWarningVisible],
  );
  const handleBlurUrl = useCallback(() => {
    if (!newAddress) {
      setUrlWarningText(t('CM_ENTER_SPACE_URL'));
      setIsUrlWarningVisible(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newAddress]);

  const handleCloseModal = () => {
    if (isWarningPopupVisible) setIsUrlWarningVisible(false);
    else onClose();
  };
  const handleCancel = () => {
    if (handleChangeCheck()) onClose();
    else setIsWarningPopupVisible(true);
  };

  const handleConfirm = async () => {
    if (handleCheckValidUrl(newAddress)) {
      setUrlWarningText(t('CM_LOGIN_POLICY_HYPHEN'));
      setIsUrlWarningVisible(true);
      return;
    }

    if (!handleCheckValidEngUrl(newAddress)) {
      setUrlWarningText(t('CM_POLICY_ALPHABET'));
      setIsUrlWarningVisible(true);
      return;
    }

    const userId = userStore.myProfile.id;
    const isLocal = process.env.REACT_APP_ENV === 'local';
    let updatedInfo = {};

    if (newAddress !== getCurrentSpaceAddress()) {
      const res = await spaceStore.searchSpaceByDomain({
        domain: newAddress,
      });
      if (res) {
        setUrlWarningText(t('CM_PROFILE_SPACE_STANDARD'));
        setIsUrlWarningVisible(true);
        return;
      }

      if (newSpaceName !== currentSpace?.name) {
        updatedInfo = {
          name: newSpaceName,
          domain: newAddress,
        };
      } else {
        updatedInfo = {
          domain: newAddress,
        };
      }
    } else {
      updatedInfo = {
        name: newSpaceName,
      };
    }

    try {
      await spaceStore.updateCurrentSpace({
        userId,
        updatedInfo,
        isLocal,
      });
      setIsUrlWarningVisible(false);
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 0);
    } catch (e) {
      console.log(`Space Update Error is...${e}`);
    }
  };

  return (
    <>
      <Wrapper
        visible
        onCancel={handleCloseModal}
        mask
        maskTransitionName=""
        centered
        title={t('CM_SPACE_EDIT')}
        width="27.5rem"
        footer={
          <>
            <Button
              style={{ marginRight: '0.5rem' }}
              type="solid"
              onClick={handleConfirm}
              disabled={handleCheckDisable()}
            >
              {t('CM_SAVE')}
            </Button>
            <Button type="outlined" onClick={handleCancel}>
              {t('CM_CANCEL')}
            </Button>
          </>
        }
      >
        {/* <GroupImageField
          groupPhoto={groupPhoto}
          handleChange={handleChangePhoto}
        /> */}
        <GroupNameField
          spaceName={newSpaceName}
          handleChange={handleChangeName}
        />
        <GroupUrlField
          urlAddress={newAddress}
          handleChange={handleChangeUrl}
          handleBlur={handleBlurUrl}
          warningVisible={isUrlWarningVisible}
          warningText={urlWarningText}
        />
      </Wrapper>
      <Message
        visible={isWarningPopupVisible}
        title={t('CM_Q_EXIT_SAVE')}
        type="warning"
        btns={[
          {
            type: 'solid',
            text: t('CM_LEAVE'),
            onClick: onClose,
          },
          {
            type: 'outlined',
            text: t('CM_CANCEL'),
            onClick: () => setIsWarningPopupVisible(false),
          },
        ]}
      />
    </>
  );
};

export default GroupEditModal;
