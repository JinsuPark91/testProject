import React from 'react';
import { useCoreStores } from 'teespace-core';
import { useObserver } from 'mobx-react';
import styled from 'styled-components';
import Photos from '../Photos';
import { getMessageTime } from '../../utils/TimeUtil';

const Wrapper = styled.div``;

const MobileRoomItem = ({ roomInfo, onClick }) => {
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
    onClick();
  };

  return useObserver(() => (
    <Wrapper onClick={handleClickRoom}>
      {getRoomPhoto()}
      <div>
        {isMyRoom
          ? userStore.myProfile.displayName
          : roomInfo.customName || roomInfo.name}
      </div>
      <div>{getMessageTime(roomInfo.metadata?.lastMessageDate)}</div>
      <div>{roomInfo.metadata?.lastMessage}</div>
      {roomInfo.metadata?.count && (
        <div>
          {roomInfo.metadata?.count > 99 ? '99+' : roomInfo.metadata?.count}
        </div>
      )}
    </Wrapper>
  ));
};

export default MobileRoomItem;
