import React, { useEffect, useState, useRef } from 'react';
import { Message, useCoreStores } from 'teespace-core';
import { Button, Tooltip } from 'antd';
import { handleCheckValidUrl, handleCheckValidEngUrl } from '../../libs/Regex';
import { getMainURL } from '../../utils/UrlUtil';
import errorIcon from '../../assets/ts_error.svg';
import {
  Wrapper,
  SubTitle,
  NameInputBox,
  UrlInputBox,
  ButtonContainer,
  ErrorIcon,
} from '../../styles/SpaceEditModalStyle';

const SpaceEditModal = ({ visible, onClose, onSuccess }) => {
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
      setUrlWarningText('웹 주소로 사용할 URL을 입력해 주세요.');
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
      setUrlWarningText('영문, 숫자, 하이픈(-)만 입력할 수 있습니다.');
      setIsUrlWarningVisible(true);
      return;
    }

    if (!handleCheckValidEngUrl(newAddress)) {
      setUrlWarningText('영문은 최소 3자 포함해 주세요.');
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
        setUrlWarningText('이미 사용중인 URL 입니다.');
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
        title="스페이스 편집"
        footer={null}
      >
        <SubTitle>스페이스 이름</SubTitle>
        <NameInputBox>
          <input
            ref={inputRef}
            placeholder="회사, 모임, 조직 이름 입력"
            value={newSpaceName}
            onChange={handleChangeName}
            onBlur={handleBlurSpaceName}
            maxLength={30}
          />
          <ErrorIcon visible={isNameWarningVisible}>
            <Tooltip
              title="스페이스 이름을 입력해 주세요."
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
            title="URL을 변경하시려면, 플랜을 업그레이드해 주세요."
            placement="bottomLeft"
            color="#232D3B"
          >
            <UrlInputBox disabled={isBasicPlan}>
              <input value={newAddress} disabled />
              <div>{getMainURL()}</div>
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
                placement="top"
                visible={isUrlWarningVisible}
              >
                <img alt="error" src={errorIcon} />
              </Tooltip>
            </ErrorIcon>
            <div>{getMainURL()}</div>
          </UrlInputBox>
        )}
        <ButtonContainer>
          <Button
            style={{ marginRight: '0.5rem' }}
            type="solid"
            onClick={handleConfirmEditSpace}
            disabled={handleCheckDisable()}
          >
            저장
          </Button>
          <Button type="outlined" onClick={handleCancelEditSpace}>
            취소
          </Button>
        </ButtonContainer>
      </Wrapper>
      <Message
        visible={isWarningPopupVisible}
        title="변경 사항을 저장하지 않고 나가시겠습니까?"
        type="warning"
        btns={[
          {
            type: 'solid',
            shape: 'round',
            text: '나가기',
            onClick: handleExit,
          },
          {
            type: 'outlined',
            shape: 'round',
            text: '취소',
            onClick: handleCancelExit,
          },
        ]}
      />
    </>
  );
};

export default SpaceEditModal;
