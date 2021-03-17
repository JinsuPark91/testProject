import React, { useEffect, useState, useRef } from 'react';
import { Message, useCoreStores } from 'teespace-core';
import { Button, Tooltip } from 'antd';
import { useTranslation } from 'react-i18next';
import { handleCheckValidUrl, handleCheckValidEngUrl } from '../../libs/Regex';
import { getMainURL } from '../../utils/UrlUtil';
import errorIcon from '../../assets/ts_error.svg';
import {
  Wrapper,
  SubTitle,
  NameInputBox,
  UrlInputBox,
  ErrorIcon,
  UrlText,
} from '../../styles/SpaceEditModalStyle';

const SpaceEditModal = ({ visible, onClose, onSuccess }) => {
  const { t } = useTranslation();
  const { userStore, spaceStore } = useCoreStores();
  const inputRef = useRef(null);
  const { currentSpace } = spaceStore;
  const getCurrentSpaceAddress = () => {
    return (
      currentSpace?.domain?.slice(0, currentSpace?.domain?.indexOf('.')) || ''
    );
  };
  const [newSpaceName, setNewSpaceName] = useState(currentSpace?.name || '');
  const [newAddress, setNewAddress] = useState(getCurrentSpaceAddress());
  const [isWarningPopupVisible, setIsWarningPopupVisible] = useState(false);
  const [isNameWarningVisible, setIsNameWarningVisible] = useState(false);
  const [urlWarningText, setUrlWarningText] = useState('');
  const [isUrlWarningVisible, setIsUrlWarningVisible] = useState(false);
  const isBasicPlan = currentSpace?.plan === 'BASIC';

  useEffect(() => {
    if (visible) {
      setTimeout(() => {
        if (inputRef.current) inputRef.current.focus();
      }, 1);
    }
  }, [visible]);

  const handleCheckChange = () => {
    return (
      newSpaceName === (currentSpace?.name || '') &&
      newAddress === (getCurrentSpaceAddress() || '')
    );
  };
  const handleCheckDisable = () => {
    return handleCheckChange() || !(newSpaceName && newAddress.length >= 3);
  };

  const handleChangeName = event => {
    const targetText = event.target.value;
    setNewSpaceName(targetText);
    if (isNameWarningVisible) {
      setIsNameWarningVisible(false);
    }
  };
  const handleChangeUrl = event => {
    const targetText = event.target.value;
    setNewAddress(targetText.toLowerCase());
    if (isUrlWarningVisible) {
      setIsUrlWarningVisible(false);
    }
  };

  const handleBlurSpaceName = () => {
    if (!newSpaceName) {
      setIsNameWarningVisible(true);
    }
  };
  const handleBlurSpaceUrl = () => {
    if (!newAddress) {
      setUrlWarningText(t('CM_ENTER_SPACE_URL'));
      setIsUrlWarningVisible(true);
    }
  };

  const handleExit = () => {
    setIsNameWarningVisible(false);
    setIsUrlWarningVisible(false);
    // tooltip 켜진 상태에서 modal close 시 tooltip 제거
    setTimeout(() => {
      setNewSpaceName(currentSpace?.name || '');
      setNewAddress(getCurrentSpaceAddress());
      setIsWarningPopupVisible(false);
      onClose();
    }, 0);
  };

  const handleCancelExit = () => {
    setIsWarningPopupVisible(false);
  };

  const handleCancelEditSpace = () => {
    if (handleCheckChange()) {
      handleExit();
    } else {
      setIsWarningPopupVisible(true);
    }
  };

  const handleConfirmEditSpace = async () => {
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

    if (!isBasicPlan && newAddress !== getCurrentSpaceAddress()) {
      const res = await spaceStore.searchSpaceByDomain({
        domain: newAddress,
      });
      if (res) {
        setUrlWarningText(t('CM_PROFILE_SPACE_STANDARD'));
        setIsUrlWarningVisible(true);
        return;
      }
      updatedInfo = {
        name: newSpaceName,
        domain: newAddress,
      };
    } else {
      // url 변경 없는 경우
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
      setIsNameWarningVisible(false);
      setIsUrlWarningVisible(false);
      setTimeout(() => {
        onClose();
        onSuccess();
      }, 0);
    } catch (e) {
      console.log(`Space Edit Error is...${e}`);
    }
  };

  return (
    <>
      <Wrapper
        visible={visible}
        onCancel={handleExit}
        mask
        maskTransitionName=""
        maskClosable={false}
        title={t('CM_SPACE_EDIT')}
        width="27.5rem"
        footer={
          <>
            <Button
              style={{ marginRight: '0.5rem' }}
              type="solid"
              onClick={handleConfirmEditSpace}
              disabled={handleCheckDisable()}
            >
              {t('CM_SAVE')}
            </Button>
            <Button type="outlined" onClick={handleCancelEditSpace}>
              {t('CM_CANCEL')}
            </Button>
          </>
        }
      >
        <SubTitle>{t('CM_SPACE_NAME')}</SubTitle>
        <NameInputBox>
          <input
            ref={inputRef}
            placeholder={t('CM_COMPANY_GROUP_MEETING_NAME')}
            value={newSpaceName}
            onChange={handleChangeName}
            onBlur={handleBlurSpaceName}
            maxLength={30}
          />
          <ErrorIcon visible={isNameWarningVisible}>
            <Tooltip
              title={t('CM_ENTER_SPACE_NAME')}
              color="#FF5151"
              placement="top"
              visible={isNameWarningVisible}
            >
              <img alt="error" src={errorIcon} />
            </Tooltip>
          </ErrorIcon>
        </NameInputBox>
        <SubTitle>URL</SubTitle>
        {isBasicPlan ? (
          <Tooltip
            title={t('CM_PROFILE_SPACE_BASIC')}
            placement="bottomLeft"
            color="#4C535D"
          >
            <UrlInputBox disabled={isBasicPlan}>
              <input value={newAddress} disabled />
              <UrlText>{getMainURL()}</UrlText>
            </UrlInputBox>
          </Tooltip>
        ) : (
          <UrlInputBox disabled={isBasicPlan}>
            <input
              value={newAddress}
              onChange={handleChangeUrl}
              onBlur={handleBlurSpaceUrl}
              maxLength={200}
            />
            <ErrorIcon visible={isUrlWarningVisible}>
              <Tooltip
                title={urlWarningText}
                color="#FF5151"
                placement="top"
                visible={isUrlWarningVisible}
              >
                <img alt="error" src={errorIcon} />
              </Tooltip>
            </ErrorIcon>
            <UrlText>{getMainURL()}</UrlText>
          </UrlInputBox>
        )}
      </Wrapper>
      <Message
        visible={isWarningPopupVisible}
        title={t('CM_Q_EXIT_SAVE')}
        type="warning"
        btns={[
          {
            type: 'solid',
            text: t('CM_LEAVE'),
            onClick: handleExit,
          },
          {
            type: 'outlined',
            text: t('CM_CANCEL'),
            onClick: handleCancelExit,
          },
        ]}
      />
    </>
  );
};

export default SpaceEditModal;
