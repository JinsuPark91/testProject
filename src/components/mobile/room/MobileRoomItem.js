import React, { useState, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { Observer } from 'mobx-react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { useCoreStores } from 'teespace-core';
import { useLongPress } from 'use-long-press';
import { useStores } from '../../../stores';
import Photos from '../../Photos';
import RoomModal from './MobileRoomModal';
import { getMessageTime } from '../../../utils/TimeUtil';
import CheckIcon from '../../../assets/check.svg';
import { MobileAlarmIcon, OpenChatBgIcon } from '../../Icons';

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
  width: ${props =>
    props.isEditMode ? 'calc(100% - 3.88rem)' : 'calc(100% - 2.75rem)'};
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
const UserCount = styled.p`
  font-size: 0.81rem;
  color: #7f7f7f;
  margin-left: 0.25rem;
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
  display: flex;
  flex-shrink: 0;
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

const TitleIconWrapper = styled.div`
  display: flex;
  flex: 0 0 0.81rem;
  padding: 0 0.15rem;
`;

const OpenChatWrapper = styled.div`
  margin-right: 0.25rem;
  line-height: 0;
`;

const MobileRoomItem = ({ index, roomInfo, editMode }) => {
  const { t } = useTranslation();
  const history = useHistory();
  const { userStore, roomStore } = useCoreStores();
  const { uiStore, mobileStore } = useStores();

  const [isRoomModalVisible, setIsRoomModalVisible] = useState(false);

  const myUserId = userStore.myProfile.id;
  const isMyRoom = roomInfo.type === 'WKS0001';
  const isDMRoom = roomInfo.isDirectMsg;
  const { isBotRoom } = roomInfo;

  const getRoomPhoto = () => {
    return (
      <Photos
        defaultDiameter="2.25"
        srcList={roomStore.getRoomPhoto(roomInfo.id)}
        className="photos"
      />
    );
  };

  const handleClickRoom = () => {
    if (editMode) return;
    history.push(`/talk/${roomInfo?.id}`);
  };

  const handleClickCheckBox = e => e.stopPropagation();

  const handleCheckDelete = () => {
    const isAdmin = roomInfo.adminId === myUserId;
    const isAlone = roomInfo.userCount === 1;
    if (isAdmin && !isDMRoom && !isAlone) {
      uiStore.openMessage({
        title: t('CM_DEL_ROOM_GROUP_05'),
        type: 'warning',
        buttons: [
          {
            type: 'outlined',
            shape: 'round',
            text: t('CM_LOGIN_POLICY_03'),
            onClick: () => uiStore.closeMessage(),
          },
        ],
      });
      return;
    }
    mobileStore.setDeleteRoomIdList(roomInfo.id);
  };

  const handleOpenRoomModal = useCallback(() => {
    if (isMyRoom) return;
    setIsRoomModalVisible(true);
  }, [isMyRoom]);
  const handleCloseModal = useCallback(() => {
    setIsRoomModalVisible(false);
  }, []);

  const bind = useLongPress(handleOpenRoomModal, {
    threshold: 300,
    captureEvent: true,
  });

  return (
    <>
      <Wrapper {...bind} onClick={handleClickRoom}>
        {getRoomPhoto()}
        <Content isEditMode={editMode}>
          <Header>
            {roomInfo.isOpenRoom && (
              <OpenChatWrapper>
                <OpenChatBgIcon width={0.75} height={0.75} />
              </OpenChatWrapper>
            )}
            <Name>
              {isMyRoom
                ? userStore.myProfile.displayName
                : roomInfo.customName || roomInfo.name}
            </Name>
            <Observer>
              {() =>
                roomInfo.isAlarmUsed ? null : (
                  <TitleIconWrapper>
                    <MobileAlarmIcon width={0.8} height={0.8} color="#e2dfdc" />
                  </TitleIconWrapper>
                )
              }
            </Observer>
            {!isMyRoom && !isDMRoom && (
              <UserCount>{roomInfo.userCount}</UserCount>
            )}
            {!editMode && (
              <LastDate>
                {getMessageTime(roomInfo.metadata?.lastMessageDate)}
              </LastDate>
            )}
          </Header>
          <Bottom>
            <LastMessage>{roomInfo.metadata?.lastMessage}</LastMessage>
            {roomInfo.metadata?.count > 0 && !editMode && (
              <MessageCount>
                {roomInfo.metadata?.count > 99
                  ? '99+'
                  : roomInfo.metadata?.count}
              </MessageCount>
            )}
          </Bottom>
        </Content>
        <Observer>
          {() => {
            return (
              <Side>
                {!isMyRoom && !isBotRoom && editMode && (
                  <CheckBox onClick={handleClickCheckBox}>
                    <CheckboxInput
                      type="checkbox"
                      name="checker"
                      id={`room-edit__check${index}`}
                      checked={mobileStore.deleteRoomIdList.includes(
                        roomInfo.id,
                      )}
                      onChange={handleCheckDelete}
                    />
                    <CheckboxLabel htmlFor={`room-edit__check${index}`} />
                  </CheckBox>
                )}
              </Side>
            );
          }}
        </Observer>
      </Wrapper>
      {isRoomModalVisible ? (
        <RoomModal roomInfo={roomInfo} onCancel={handleCloseModal} />
      ) : null}
    </>
  );
};

export default MobileRoomItem;
