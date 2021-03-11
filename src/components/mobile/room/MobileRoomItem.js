import React from 'react';
import { useCoreStores } from 'teespace-core';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import Photos from '../../Photos';
import { getMessageTime } from '../../../utils/TimeUtil';
import CheckIcon from '../../../assets/check.svg';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 0.81rem 1rem;
  cursor: pointer;
`;
const Content = styled.div`
  display: flex;
  flex-direction: column;
  width: calc(100% - 2.25rem);
  height: 100%;
  margin-left: 0.5rem;
`;
const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: 0.06rem;
`;
const Name = styled.p`
  font-size: 0.81rem;
  line-height: 1.19rem;
  color: #000;
  max-width: 12rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
const LastDate = styled.p`
  font-size: 0.69rem;
  line-height: 1.06rem;
  color: #7b7b7b;
  margin-left: auto;
`;
const Bottom = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  height: 100%;
`;
const Side = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;
const LastMessage = styled.p`
  font-size: 0.69rem;
  line-height: 1.06rem;
  color: #9a9a9a;
  width: 15rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
const MessageCount = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.095rem 0.31rem;
  margin-top: 0.44rem;
  margin-left: auto;
  color: #fff;
  font-size: 0.56rem;
  line-height: 0.81rem;
  background-color: #dc4547;
  border-radius: 0.56rem;
`;
const CheckBox = styled.div`
  width: 1.13rem;
  height: 1.13rem;
`;
const CheckboxInput = styled.input`
  display: none;
  & + label {
    cursor: pointer;
    background-repeat: no-repeat;
  }
  &:checked + label {
    background-image: url('${CheckIcon}');
    background-size: 0.88rem 0.88rem;
    background-position: center center;
    background-color: #232d3b;
    border-color: #232d3b;
  }
  &:disabled + label {
  }
`;
const CheckboxLabel = styled.label`
  width: 100%;
  height: 100%;
  border: 1px solid #d0ccc7;
  border-radius: 50%;
  margin: 0;
`;
const MobileRoomItem = ({ roomInfo, roomEditMode, handleRoomIdList }) => {
  const history = useHistory();
  const { userStore } = useCoreStores();
  const isMyRoom = roomInfo.type === 'WKS0001';
  const isDMRoom = roomInfo.isDirectMsg;

  const getRoomPhoto = () => {
    let roomPhoto = null;
    if (isMyRoom) {
      roomPhoto = [
        userStore.getProfilePhotoURL(userStore.myProfile.id, 'small'),
      ];
    } else {
      let userIds = roomInfo.memberIdListString.split(',').splice(0, 4);
      if (isDMRoom) {
        userIds = userIds.filter(userId => userId !== userStore.myProfile.id);
      }
      roomPhoto = userIds.map(userId =>
        userStore.getProfilePhotoURL(userId, 'small'),
      );
    }

    return (
      <Photos defaultDiameter="2.25" srcList={roomPhoto} className="photos" />
    );
  };

  const handleClickRoom = () => {
    history.push(`/talk/${roomInfo?.id}`);
  };

  const handleClickCheckBox = e => {
    e.stopPropagation();
  };
  const handleCheckDelete = () => {
    handleRoomIdList(roomInfo.id);
  };

  return (
    <Wrapper onClick={handleClickRoom}>
      {getRoomPhoto()}
      <Content>
        <Header>
          <Name>
            {isMyRoom
              ? userStore.myProfile.displayName
              : roomInfo.customName || roomInfo.name}
          </Name>
          {!roomEditMode && (
            <LastDate>
              {getMessageTime(roomInfo.metadata?.lastMessageDate)}
            </LastDate>
          )}
        </Header>
        <Bottom>
          <LastMessage>{roomInfo.metadata?.lastMessage}</LastMessage>
          {roomInfo.metadata?.count > 0 && (
            <MessageCount>
              {roomInfo.metadata?.count > 99 ? '99+' : roomInfo.metadata?.count}
            </MessageCount>
          )}
        </Bottom>
      </Content>
      <Side>
        {!isMyRoom && roomEditMode && (
          <CheckBox onClick={handleClickCheckBox}>
            <CheckboxInput
              type="checkbox"
              name="checker"
              id="checker1"
              onChange={handleCheckDelete}
            />
            <CheckboxLabel for="checker1"></CheckboxLabel>
          </CheckBox>
        )}
      </Side>
    </Wrapper>
  );
};

export default MobileRoomItem;
