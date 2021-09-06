import React, { useContext } from 'react';
import { Observer, useLocalStore } from 'mobx-react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styled, { ThemeContext } from 'styled-components';
import { useCoreStores } from 'teespace-core';
import { useStores } from '../../../../stores';
import Photos from '../../../Photos';
import { OpenChatIcon } from '../../../Icons';

const MobileOpenRoomItem = ({ roomInfo, style }) => {
  const { t } = useTranslation();
  const history = useHistory();
  const themeContext = useContext(ThemeContext);
  const { roomStore, userStore } = useCoreStores();
  const { uiStore } = useStores();

  const store = useLocalStore(() => ({
    onRequest: false,
  }));

  const handleFail = () => {
    uiStore.openMessage({
      title: t('CM_OPEN_ROOM_HOME_16'),
      subTitle: t('CM_OPEN_ROOM_HOME_17'),
      buttons: [
        {
          type: 'solid',
          text: t('CM_LOGIN_POLICY_03'),
          onClick: () => uiStore.closeMessage(),
        },
      ],
    });
  };

  const handleEnter = async () => {
    const myUserId = userStore.myProfile.id;
    if (store.onRequest) return;

    try {
      store.onRequest = true;
      const res = await roomStore.enterRoom({
        myUserId,
        roomId: roomInfo.id,
      });

      if (!res || !res.result) handleFail();
      else {
        uiStore.closeMessage();
        history.push(`/talk/${res.roomId}`);
      }
    } catch (e) {
      console.error(`Room Enter Error: ${e}`);
      handleFail();
    } finally {
      store.onRequest = false;
    }
  };

  const handleRequest = async () => {
    try {
      await roomStore.requestEnterRoom({
        roomId: roomInfo.id,
      });
      await roomStore.fetchOpenRoomList();
    } catch (e) {
      console.log(`Enter Request Error: ${e}`);
    }
    uiStore.closeMessage();
  };

  const handleClick = () => {
    if (roomInfo.isRequested) return;

    if (roomInfo.isBanned) {
      uiStore.openMessage({
        title: t('CM_OPEN_ROOM_HOME_16'),
        subTitle: t('CM_OPEN_ROOM_HOME_17'),
        buttons: [
          {
            type: 'solid',
            text: t('CM_LOGIN_POLICY_03'),
            onClick: () => uiStore.closeMessage(),
          },
        ],
      });
      return;
    }

    if (roomInfo.isJoined) {
      history.push(`/talk/${roomInfo.id}`);
      return;
    }

    if (roomInfo.isJoinable) {
      uiStore.openMessage({
        title: roomInfo.customName || roomInfo.name,
        subTitle: t('CM_OPEN_ROOM_HOME_06'),
        type: 'custom',
        customBadge: (
          <CustomBadge>
            <Photos
              srcList={roomStore.getRoomPhoto(roomInfo.id)}
              defaultDiameter="2.25"
            />
          </CustomBadge>
        ),
        buttons: [
          {
            type: 'solid',
            text: t('CM_OPEN_ROOM_HOME_07'),
            onClick: handleEnter,
          },
          {
            type: 'outlined',
            text: t('CM_CANCEL'),
            onClick: () => uiStore.closeMessage(),
          },
        ],
      });
      return;
    }

    uiStore.openMessage({
      title: roomInfo.customName || roomInfo.name,
      subTitle: t('TEST_REQUEST'),
      type: 'custom',
      customBadge: (
        <CustomBadge>
          <Photos
            srcList={roomStore.getRoomPhoto(roomInfo.id)}
            defaultDiameter="2.25"
          />
        </CustomBadge>
      ),
      buttons: [
        {
          type: 'solid',
          text: t('TEST_REQUEST_OK'),
          onClick: handleRequest,
        },
        {
          type: 'outlined',
          text: t('CM_CANCEL'),
          onClick: () => uiStore.closeMessage(),
        },
      ],
    });
  };

  return (
    <Wrapper style={style}>
      <Observer>
        {() => {
          let statusText = '';
          if (roomInfo.isJoined) statusText = t('CM_OPEN_ROOM_HOME_10');
          else if (roomInfo.isRequested) statusText = t('CM_OPEN_ROOM_HOME_11');

          return (
            <>
              <Photos
                srcList={roomStore.getRoomPhoto(roomInfo.id)}
                defaultDiameter={2.25}
              />
              <RoomInfo>
                <RoomTitle>{roomInfo.customName || roomInfo.name}</RoomTitle>
                <RoomNum>{roomInfo.userCount}</RoomNum>
                <StatusText>{statusText}</StatusText>
              </RoomInfo>
            </>
          );
        }}
      </Observer>
      <RoomJoinBtn onClick={handleClick}>
        <OpenChatIcon width={1} height={1} color={themeContext.IconNormal} />
      </RoomJoinBtn>
    </Wrapper>
  );
};

export default MobileOpenRoomItem;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
`;

const RoomInfo = styled.div`
  display: flex;
  align-items: center;
  width: calc(100% - 4.5rem);
`;

const RoomTitle = styled.p`
  font-size: 0.81rem;
  max-width: 70%;
  margin-left: 0.75rem;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const RoomNum = styled.p`
  font-size: 0.81rem;
  color: #7f7f7f;
  margin-left: 0.25rem;
`;

const StatusText = styled.p`
  margin-left: auto;
  padding: 0 0.25rem 0 0.5rem;
  font-size: 0.63rem;
  color: #696969;
  white-space: nowrap;
`;

const RoomJoinBtn = styled.button`
  opacity: ${({ disabled }) => (disabled ? '0.4' : '1')};
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  padding: 0.25rem;
  margin-left: auto;
  margin-right: 1rem;
  line-height: 0;
  background-color: transparent;
  border: none;
  border-radius: 0.25rem;

  &:hover {
    background-color: ${({ theme }) => theme.StateDark};
  }
`;

const CustomBadge = styled.div`
  display: flex;
  justify-content: center;
`;
