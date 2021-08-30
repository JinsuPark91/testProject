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
      subTitle: i18n.t('TEST_REQUEST'),
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
          text: i18n.t('TEST_REQUEST_OK'),
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

  if (openRoom.isRequested) {
    console.log('이미 입장요청 했습니다.');
  } else if (openRoom.isJoined) {
    // 이미 입장한 방이면 바로 보내기
    console.log('이미 입장한 방입니다. 오픈룸으로 바로 이동합니다.');
    history.push(`/s/${openRoom.id}/talk`);
  } else if (openRoom.isBanned) {
    console.log(
      '참여제한이 걸려있는 방입니다. 룸 관리자의 참여 제한 해제가 필요합니다.',
    );
    openFailRoomEnter();
  } else if (openRoom.isJoinable) {
    // 바로 입장 가능
    console.log('임장가능한 방입니다. 룸에 입장하시겠습니까?');
    openEnterModal();
  } else {
    // 요청 후 입장 가능
    console.log(
      '입장요청이 필요한 방입니다. 룸관리자에게 입장요청 하겠습니까?',
    );
    openRequestModal();
  }
}

const CustomBadge = styled.div`
  display: flex;
  justify-content: center;
`;
