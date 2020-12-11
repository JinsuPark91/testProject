import React, { useState } from 'react';
import styled from 'styled-components';
import {
  CloseOutlined,
  PlusCircleFilled,
  MinusCircleFilled,
} from '@ant-design/icons';

function ProfileImageModal({ profilePhoto = '', onCancel }) {
  const [enlargeStack, setEnlargeStack] = useState(4);
  const addStack = e => {
    e.stopPropagation();
    setEnlargeStack(s => s + 1);
  };
  const subStack = e => {
    e.stopPropagation();
    setEnlargeStack(s => s - 1);
  };

  return (
    <ModalWrap>
      <ModalInner>
        <ModalHeader>
          <Title>나의 프로필 사진</Title>
          <CloseButton type="close" onClick={onCancel}>
            <Blind>닫기</Blind>
            <CloseOutlined />
          </CloseButton>
        </ModalHeader>
        <img
          src={profilePhoto}
          alt=""
          style={{ height: `${25 * enlargeStack}%` }}
        />
      </ModalInner>
      <ModalFooter>
        <Button disabled={enlargeStack === 4} onClick={subStack}>
          <MinusCircleFilled />
          <Blind>축소</Blind>
        </Button>
        <Button disabled={enlargeStack === 8} onClick={addStack}>
          <PlusCircleFilled />
          <Blind>확대</Blind>
        </Button>
      </ModalFooter>
    </ModalWrap>
  );
}

const ModalWrap = styled.div`
  overflow: hidden;
  position: absolute;
  top: 0;
  left: 18.13rem;
  width: 17.5rem;
  border-radius: 0.25rem;
  box-shadow: 0 5px 10px 0 rgba(0, 0, 0, 0.3);
  text-align: center;
  z-index: 1000;
`;
const ModalInner = styled.div`
  overflow: hidden;
  position: relative;
  height: 24.56rem;
  border-radius: 0.25rem 0.25rem 0 0;
  img {
    position: absolute;
    top: 50%;
    left: 50%;
    -webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    width: auto;
    height: 100%;
  }
`;
const ModalHeader = styled.div`
  position: relative;
  padding: 0 2.56rem;
  background: linear-gradient(rgba(0,0,0,0.35), rgba(0,0,0,0));
  color: #fff;
  z-index: 5;
`;
const Title = styled.p`
  font-size: 0.94rem;
  line-height: 2.56rem;
`;
const CloseButton = styled.button`
  position: absolute;
  top: 0;
  right: 0;
  width: 2.56rem;
  height: 2.56rem;
  font-size: 0.875rem;
  background-color: transparent;
  border: 0;
  cursor: pointer;
`;
const ModalFooter = styled.div`
  padding: 0.75rem 0;
  background-color: #fff;
`;
const Button = styled.button`
  width: 1.5rem;
  height: 1.5rem;
  margin: 0 1.875rem;
  background-color: transparent;
  border: 0;
  font-size: 1.5rem;
  line-height: 0;
  color: #6c56e5;
  cursor: pointer;
  &:disabled {
    color: #ccc;
    cursor: not-allowed;
  }
`;
const Blind = styled.span`
  position: absolute;
  clip: rect(0 0 0 0);
  width: 1px;
  height: 1px;
  margin: -1px;
  overflow: hidden;
`;

export default ProfileImageModal;
