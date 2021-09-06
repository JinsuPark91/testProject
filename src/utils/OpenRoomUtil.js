import React from 'react';
import { UserStore, RoomStore, logEvent } from 'teespace-core';
import styled from 'styled-components';
import { i18n } from '../i18n';
import Photos from '../components/Photos';
import { rootStore } from '../stores';

export default function openRoomModal({ openRoom, history }) {
  const { uiStore } = rootStore;
  const openFailRoomEnter = () => {
    uiStore.openMessage({
      roomInfo: openRoom,
      isOpenRoom: true,
      title: i18n.t('CM_OPEN_ROOM_HOME_16'),
      subTitle: i18n.t('CM_OPEN_ROOM_HOME_17'),
      buttons: [
        {
          type: 'solid',
          text: i18n.t('CM_LOGIN_POLICY_03'),
          onClick: () => {
            uiStore.closeMessage();
          },
        },
      ],
    });
  };

  const handleConfirmEnter = async () => {
    const myUserId = UserStore.myProfile.id;
    // if (store.onRequest) return;

    try {
      // store.onRequest = true;
      const res = await RoomStore.enterRoom({
        myUserId,
        roomId: openRoom.id,
      });

      if (!res.result) {
        openFailRoomEnter();
      } else if (res?.roomId) {
        history.push(`/s/${openRoom.id}/talk`);
        uiStore.closeMessage();
      }
      logEvent('room', 'clickEnterOpenRoomBtn');
    } catch (err) {
      console.error('ROOM ENTER ERROR : ', err);
      openFailRoomEnter();
    } finally {
      // store.onRequest = false;
    }
  };

  const handleRequestOK = async () => {
    try {
      await RoomStore.requestEnterRoom({
        roomId: openRoom.id,
      });
    } catch (err) {
      console.log('입장 요청 에러');
    }

    uiStore.closeMessage();
  };

  const openEnterModal = () => {
    uiStore.openMessage({
      title: openRoom.name,
      roomInfo: openRoom,
      isOpenRoom: true,
      subTitle: i18n.t('CM_OPEN_ROOM_HOME_06'),
      type: 'custom',
      customBadge: (
        <CustomBadge>
          <Photos
            srcList={RoomStore.getRoomPhoto(openRoom.id)}
            defaultDiameter="2.26"
          />
        </CustomBadge>
      ),
      buttons: [
        {
          type: 'solid',
          text: i18n.t('CM_OPEN_ROOM_HOME_07'),
          onClick: handleConfirmEnter,
        },
        {
          type: 'outlined',
          text: i18n.t('CM_CANCEL'),
          onClick: () => {
            uiStore.closeMessage();
          },
        },
      ],
    });
  };

  const openRequestModal = () => {
    uiStore.openMessage({
      title: openRoom.name,
      roomInfo: openRoom,
      isOpenRoom: true,
      subTitle: i18n.t('CM_OPEN_ROOM_HOME_13'),
      type: 'custom',
      customBadge: (
        <CustomBadge>
          <Photos
            srcList={RoomStore.getRoomPhoto(openRoom.id)}
            defaultDiameter="2.26"
          />
        </CustomBadge>
      ),
      buttons: [
        {
          type: 'solid',
          text: i18n.t('CM_OPEN_ROOM_HOME_14'),
          onClick: handleRequestOK,
        },
        {
          type: 'outlined',
          text: i18n.t('CM_CANCEL'),
          onClick: () => {
            uiStore.closeMessage();
          },
        },
      ],
    });
  };
  if (isMobile && !openRoom.isJoined) {
    history.push(`/friend`);
  }
  if (openRoom.isRequested) {
    console.log('이미 입장요청 했습니다.');
  } else if (openRoom.isJoined) {
    // 이미 입장한 방이면 바로 보내기
    if (isMobile) {
      history.push(`/talk/${openRoom.id}`);
    } else {
      history.push(`/s/${openRoom.id}/talk`);
    }
  } else if (openRoom.isBanned) {
    // 참여제한 된 방
    openFailRoomEnter();
  } else if (openRoom.isJoinable) {
    // 바로 입장 가능
    openEnterModal();
  } else {
    // 요청 후 입장 가능
    openRequestModal();
  }
}

const CustomBadge = styled.div`
  display: flex;
  justify-content: center;
`;
