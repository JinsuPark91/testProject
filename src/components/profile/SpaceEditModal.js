import React, { useState } from 'react';
import { Message, useCoreStores } from 'teespace-core';
import styled, { css } from 'styled-components';
import { Button, Input, Modal, Tooltip } from 'antd';
import { handleCheckValidUrl } from '../../libs/Regex';
import errorIcon from '../../assets/ts_error.svg';

const Wrapper = styled(Modal)`
  width: 27.5rem;
  height: 18.63rem;
  .ant-modal-body {
    padding-top: 0rem;
  }
`;

const SubTitle = styled.div`
  font-size: 0.81rem;
  color: #000000;
  margin: 1.25rem 0 0.44rem 0;
`;

const InputBox = styled(Input)``;

const UrlInputBox = styled.div`
  display: flex;
  align-items: center;
  padding: 0 0.75rem;
  height: 1.8rem;
  background: ${({ disabled }) => (disabled ? '#cccccc' : '#fff')};
  ${({ disabled }) =>
    disabled
      ? css`
          color: #fff;
          cursor: not-allowed;
        `
      : css`
          &:hover {
            background-color: #faf8f7;
            border: 0.06rem solid #d0ccc7;
          }
        `}

  border-radius: 0.25rem;
  border: 0.06rem solid #d0ccc7;
  &:not(:disabled):focus-within {
    border: 1px solid #7b7671;
  }

  & input {
    background: transparent;
    margin-right: 0.5rem;
    height: 1.13rem;
    border: 0;

    ${({ disabled }) =>
      disabled &&
      css`
        cursor: not-allowed;
      `}

    font-size: 0.75rem;
    width: 100%;

    ::placeholder {
      color: #bdc6d3;
    }

    :disabled::placeholder {
      color: #fff;
    }

    :focus {
      outline: 0;
    }
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 2.25rem;
`;

const ErrorIcon = styled.div`
  display: ${props => (props.visible ? 'flex' : 'none')};
`;

const SpaceEditModal = ({ visible, onClose, onSuccess }) => {
  const { userStore, spaceStore } = useCoreStores();
  const { currentSpace } = spaceStore;

  const [newSpaceName, setNewSpaceName] = useState(currentSpace?.name || '');
  const [newAddress, setNewAddress] = useState(currentSpace?.domain || '');
  const [isWarningPopupVisible, setIsWarningPopupVisible] = useState(false);
  const [warningText, setWarningText] = useState('');
  const [isWarningTextVisible, setIsWarningTextVisible] = useState(false);

  const isBasicPlan = currentSpace?.plan === 'BASIC';

  const handleCheckChange = () => {
    return (
      newSpaceName === (currentSpace?.name || '') &&
      newAddress === (currentSpace?.domain || '')
    );
  };

  const handleCheckDisable = () => {
    return handleCheckChange() || !(newSpaceName && newAddress);
  };

  const handleChangeName = event => {
    const targetText = event.target.value;
    setNewSpaceName(targetText);
  };

  const handleChangeUrl = event => {
    const targetText = event.target.value;
    setNewAddress(targetText);
    if (isWarningTextVisible) {
      setIsWarningTextVisible(false);
    }
  };

  const handleExit = () => {
    setIsWarningTextVisible(false);
    // tooltip 켜진 상태에서 modal close 시 tooltip 제거
    setTimeout(() => {
      setNewSpaceName(currentSpace?.name || '');
      setNewAddress(currentSpace?.domain || '');
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
      setWarningText('영문, 숫자, 하이픈(-)만 입력할 수 있습니다.');
      setIsWarningTextVisible(true);
      return;
    }

    const userId = userStore.myProfile.id;
    const isLocal = process.env.REACT_APP_ENV === 'local';
    let updatedInfo = {};

    if (!isBasicPlan && newAddress !== currentSpace?.domain) {
      const res = await spaceStore.searchSpaceByDomain({
        domain: newAddress,
      });
      if (res) {
        setWarningText('이미 사용중인 URL 입니다.');
        setIsWarningTextVisible(true);
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
      setIsWarningTextVisible(false);
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
        maskClosable={false}
        title="스페이스 편집"
        footer={null}
      >
        <SubTitle>스페이스 이름</SubTitle>
        <InputBox
          placeholder="회사, 모임, 조직 이름 입력"
          value={newSpaceName}
          onChange={handleChangeName}
        />
        <SubTitle>URL</SubTitle>
        {isBasicPlan ? (
          <Tooltip
            title="URL을 변경하시려면, 플랜을 업그레이드해 주세요."
            placement="bottomLeft"
            color="#0b1d41"
            // overlayStyle={{ whiteSpace: 'nowrap' }}
          >
            <UrlInputBox disabled={isBasicPlan}>
              <input value={newAddress} disabled />
              <div>.wapl.ai</div>
            </UrlInputBox>
          </Tooltip>
        ) : (
          <UrlInputBox disabled={isBasicPlan}>
            <input value={newAddress} onChange={handleChangeUrl} />
            <ErrorIcon visible={isWarningTextVisible}>
              <Tooltip
                title={warningText}
                placement="top"
                visible={isWarningTextVisible}
              >
                <img alt="error" src={errorIcon} />
              </Tooltip>
            </ErrorIcon>
            <div>.wapl.ai</div>
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
