import React from 'react';
import { useCoreStores } from 'teespace-core';
import styled from 'styled-components';
import Photos from '../Photos';

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
    // onClick();
  };

  console.log(roomInfo);

  return (
    <Wrapper onClick={handleClickRoom}>
      {getRoomPhoto()}
      <div>
        {isMyRoom
          ? userStore.myProfile.displayName
          : roomInfo.customName || roomInfo.name}
      </div>
      <div>{roomInfo.metadata?.lastMessageDate}</div>
      <div>{roomInfo.metadata?.lastMessage}</div>
    </Wrapper>
  );
};

export default MobileRoomItem;
