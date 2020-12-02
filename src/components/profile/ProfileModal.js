import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import { Modal } from 'antd';
import { CloseOutlined } from '@ant-design/icons';

function ProfileModal({ visible, onCancel, outLine, topButton, userContent, subContent, footer, width, style }) {
  const [isEditMode, setIsEditMode] = useState(false);

  return (
    <ModalWrap
      visible={visible}
      maskClosable={true}
      mask={isEditMode}
      onCancel={onCancel}
      width={width}
      title={null}
      closable={false}
      outLine={outLine}
      footer={footer}
      style={style}
    >
      <UserArea outLine={outLine}>
        {topButton && (
          <TopButtonBox>
            {/* 
            {isBookMark ?
              // 클릭시 click 추가
              <TopButton type="bookMark"><Blind>즐겨찾기</Blind></TopButton>
              : (isMyId ?
                <DropBox>
                  <TopButton type="background"><Blind>배경이미지 변경</Blind></TopButton>
                  <DropList>
                    <DropItem>내 PC에서 배경 변경</DropItem>
                    <DropItem>테마 이미지에서 변경</DropItem>
                    <DropItem>기본 이미지로 변경</DropItem>
                  </DropList>
                </DropBox>
                : null)}
            */}
            <TopButton type="close"><Blind>닫기</Blind><CloseOutlined /></TopButton>
          </TopButtonBox>
        )}
        {userContent}
      </UserArea>
      {subContent}
    </ModalWrap>
  );
};

const ModalWrap = styled(Modal)`
  .ant-modal-content {
    box-shadow: 0 5px 10px 0 rgba(0, 0, 0, 0.3);
    ${props => props.outLine ?
    css`
      border: 1px solid #c6ced6;
      border-radius: 0.25rem;
      ` :
    css`
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
  font-size: 0.75rem;
  color: #fff;
  text-align: center;
  ${props => props.outLine ?
    css`
      position: relative;
      padding: 1.25rem 1.5rem 0.9375rem;
      border-radius: 0.1875rem 0.1875rem 1.875rem 1.875rem;
      z-index: 5;
      ` :
    css`
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
{/* 
const DropBox = styled.div`
  position: relative;
`;
const DropList = styled.ul`
  position: absolute;
  top: 1.56rem;
  left: 1.56rem;
  padding: 0.25rem 0;
  background-color: #fff;
  border: 1px solid #C6CED6;
  box-shadow: 0 1px 4px 0 rgba(0,0,0,0.20);
  border-radius: 0.25rem;
`;
const DropItem = styled.li`
  padding: 0 0.75rem;
  font-size: 0.75rem;
  color: #000;
  line-height: 1.63rem;
  white-space: nowrap;
  border-radius: 0.81rem;
  cursor: pointer;
  &:hover {
    background-color: #dcddff;
  }
  &:active,
  &:focus {
    background-color: #bcbeff;
  }
`;
*/}
const TopButton = styled.button`
  width: 2rem;
  height: 2rem;
  background-color: transparent;
  border-radius: 50%;
  border: 0;
  cursor: pointer;
  ${props => {
    switch (props.type) {
      case 'close':
        return css`
          margin-left: auto;
          font-size: 0.875rem;
        `;

        {/* 
      case 'bookMark':
        return css`
          background: url(${starLineIcon}) no-repeat 50% 50%;
          background-size: 0.88rem 0.88rem;
          &:hover {
            background-color: rgba(255,255,255,0.3);
          }
          &:active,
          &:focus {
            background-image: url(${starIcon});
            background-color: rgba(90,95,255,0.8);
          }
          ${props => (props.click) &&
            css`
            background-image: url(${starIcon});
            background-color: rgba(90,95,255,0.8);
            &:hover {
              background-color: rgba(90,95,255,0.8);
            }
          `}
        `;
      case 'background':
        return css`
          background: rgba(000,000,000,0.8) url(${photoIcon}) no-repeat 50% 50%;
          background-size: 0.88rem 0.88rem;
          &:hover {
            background-color: rgba(255,255,255,0.3);
          }
          &:active,
          &:focus {
            background-color: rgba(90,95,255,0.8);
          }
        `;
        */}
    }
  }}
`;

export default ProfileModal;