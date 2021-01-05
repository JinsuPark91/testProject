import React, { useState } from 'react';
import { Message, useCoreStores } from 'teespace-core';
import styled, { css } from 'styled-components';
import { Button, Input, Modal, Tooltip } from 'antd';

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
            background-color: #dcddff;
            border-color: #c6ced6;
          }
        `}

  border-radius: 25px;
  border: 1px solid #e3e7eb;
  &:not(:disabled):focus-within {
    border: 1px solid #6c56e5;
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

const WarningText = styled.div`
  display: ${props => (props.visible ? 'flex' : 'none')};
  margin-top: 0.5rem;
  color: red;
`;

const SpaceEditModal = ({ visible, onClose, onSuccess }) => {
  const { userStore, spaceStore } = useCoreStores();
  const { currentSpace } = spaceStore;

  const [newSpaceName, setNewSpaceName] = useState(currentSpace?.name || '');
  const [newAddress, setNewAddress] = useState(currentSpace?.domain || '');
  const [isWarningPopupVisible, setIsWarningPopupVisible] = useState(false);
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
  };

  const handleConfirmEditSpace = async () => {
    const res = await spaceStore.searchSpaceByDomain({
      domain: newAddress,
    });
    if (res) {
      setIsWarningTextVisible(true);
      return;
    }

    const userId = userStore.myProfile.id;
    const updatedInfo = {
      name: newSpaceName,
      domain: newAddress,
    };
    const isLocal = process.env.REACT_APP_ENV === 'local';

    try {
      await spaceStore.updateCurrentSpace({
        userId,
        updatedInfo,
        isLocal,
      });
      setIsWarningTextVisible(false);
      onClose();
      onSuccess();
    } catch (e) {
      console.log(`Space Edit Error is...${e}`);
    }
  };

  const handleExit = () => {
    setNewSpaceName(currentSpace?.name || '');
    setNewAddress(currentSpace?.domain || '');
    setIsWarningTextVisible(false);
    setIsWarningPopupVisible(false);
    onClose();
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

  return (
    <>
      <Wrapper
        visible={visible}
        onCancel={onClose}
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
          >
            <UrlInputBox disabled={isBasicPlan}>
              <input value={newAddress} disabled />
              <div>.wapl.ai</div>
            </UrlInputBox>
          </Tooltip>
        ) : (
          <UrlInputBox disabled={isBasicPlan}>
            <input value={newAddress} onChange={handleChangeUrl} />
            <div>.wapl.ai</div>
          </UrlInputBox>
        )}
        <WarningText visible={isWarningTextVisible}>
          이미 사용중인 URL입니다.
        </WarningText>
        <ButtonContainer>
          <Button
            style={{ marginRight: '0.5rem' }}
            type="solid"
            shape="round"
            onClick={handleConfirmEditSpace}
            disabled={handleCheckDisable()}
          >
            저장
          </Button>
          <Button
            style={{ backgroundColor: '#fff' }}
            type="outlined"
            shape="round"
            onClick={handleCancelEditSpace}
          >
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
