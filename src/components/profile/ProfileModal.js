import React, { useState, useCallback } from 'react';
import styled, { css } from 'styled-components';
import { Modal, Dropdown } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { useObserver } from 'mobx-react';
import { useCoreStores } from 'teespace-core';
import starLineIcon from '../../assets/ts_star_line.svg';
import starIcon from '../../assets/ts_star.svg';

function ProfileModal({
  visible,
  onCancel,
  isEditMode,
  mask = true,
  toggleFav,
  checkFav = () => false,
  isNotMyFriend = () => false,
  userId,
  backgroundPhotoURL,
  outLine,
  topButton,
  type,
  userContent,
  subContent,
  footer,
  width,
  style,
}) {
  const { userStore } = useCoreStores();
  const [isFav, setIsFav] = useState(checkFav());
  const handleToggleFav = async () => {
    setIsFav(f => !f);
    try {
      await toggleFav();
    } catch (e) {
      console.log(`Error ${e}`);
      setIsFav(checkFav());
    }
  };

  return useObserver(() => (
    <ModalWrap
      visible={visible}
      mask={mask && isEditMode}
      onCancel={onCancel}
      width={width}
      isNotMyFriend={isNotMyFriend}
      title={null}
      closable={false}
      maskClosable={!isEditMode}
      outLine={outLine}
      footer={footer}
      style={style}
      transitionName=""
      maskTransitionName=""
    >
      <UserArea
        outLine={outLine}
        isEditMode={isEditMode}
        imageSrc={backgroundPhotoURL}
      >
        {topButton && (
          <>
            <TopButtonBox>
              {type === 'user' &&
                !(userId === userStore.myProfile.id) &&
                !isNotMyFriend() && (
                  <TopButton
                    type="bookMark"
                    isFav={isFav}
                    onClick={handleToggleFav}
                  >
                    <Blind>즐겨찾기</Blind>
                  </TopButton>
                )}
              <TopButton type="close" onClick={onCancel}>
                <Blind>닫기</Blind>
                <CloseOutlined />
              </TopButton>
            </TopButtonBox>
          </>
        )}
        {userContent}
      </UserArea>
      {subContent}
    </ModalWrap>
  ));
}

const ModalWrap = styled(Modal)`
  .ant-modal-content {
    box-shadow: 0 5px 10px 0 rgba(0, 0, 0, 0.3);
    ${props =>
      props.outLine
        ? css`
            border: 1px solid #c6ced6;
            border-radius: 0.25rem;
          `
        : css`
            border-radius: 0.35rem 0.35rem 0.25rem 0.25rem;
          `};
  }
  .ant-modal-body {
    padding: 0;
  }
  .ant-modal-footer {
    padding: 0;
    border: none;
  }
`;
const UserArea = styled.div`
  background-color: #0b1d41;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  font-size: 0.75rem;
  color: #fff;
  text-align: center;
  ${props =>
    props.isEditMode &&
    props.imageSrc &&
    css`
      background-image: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)),
        url('${props.imageSrc}');
    `};
  ${props =>
    props.outLine
      ? css`
          position: relative;
          padding: 1.25rem 1.5rem 0.9375rem;
          border-radius: 0.1875rem 0.1875rem 1.875rem 1.875rem;
          z-index: 5;
        `
      : css`
          border-radius: 0.25rem 0.25rem 1.875rem 1.875rem;
        `};
`;
const Blind = styled.span`
  position: absolute;
  clip: rect(0 0 0 0);
  width: 1px;
  height: 1px;
  margin: -1px;
  overflow: hidden;
`;
const TopButtonBox = styled.div`
  display: flex;
  align-items: center;
  padding: 0.25rem 0.25rem 0;
`;
const TopButton = styled.button`
  width: 2rem;
  height: 2rem;
  background-color: transparent;
  border-radius: 50%;
  border: 0;
  cursor: pointer;
  ${props => {
    switch (props.type) {
      case 'bookMark':
        return css`
          background: url(${starLineIcon}) no-repeat 50% 50%;
          background-size: 0.88rem 0.88rem;
          &:hover {
            background-color: rgba(255, 255, 255, 0.3);
          }
          &:active {
            background-image: url(${starIcon});
            background-color: rgba(90, 95, 255, 0.8);
          }
          ${props =>
            props.isFav &&
            css`
              background-image: url(${starIcon});
            `}
          ${props =>
            !props.isFav &&
            css`
              background-image: url(${starLineIcon});
            `}
        `;
      case 'close':
        return css`
          margin-left: auto;
          font-size: 0.875rem;
        `;
    }
  }}
`;

export default ProfileModal;
