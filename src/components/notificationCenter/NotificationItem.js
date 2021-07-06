import React from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { useCoreStores, Icons } from 'teespace-core';
import { AlarmPlainMessage } from 'teespace-talk-app';
import { Trans, useTranslation } from 'react-i18next';
import { useObserver } from 'mobx-react';
import { DateTime } from 'luxon';
import { useStores } from '../../stores';
import {
  NoteIcon,
  CalendarIcon,
  DriveIcon,
  MailIcon,
  ChattingIcon,
} from '../Icons';

import Photos from '../Photos';

const { CloseIcon } = Icons;

const ICON_PROPS = { width: 0.875, height: 0.875, color: '#fff' };
const APP_INFO = {
  CHN0001: {
    icon: <ChattingIcon {...ICON_PROPS} />,
    color: '#cccccc',
  },

  CHN0002: {
    icon: <MailIcon {...ICON_PROPS} />,
    color: '#232d3b',
  },

  CHN0003: {
    icon: <NoteIcon {...ICON_PROPS} />,
    color: '#47bdd6',
  },

  CHN0005: {
    icon: <CalendarIcon {...ICON_PROPS} />,
    color: '#f3bf48',
  },

  CHN0006: {
    icon: <DriveIcon {...ICON_PROPS} />,
    color: '#205855',
  },
};

const NotificationItem = ({ style, item }) => {
  const { t } = useTranslation();
  const { push } = useHistory();
  const { notificationStore, roomStore, userStore } = useCoreStores();
  const { uiStore } = useStores();

  const handleDelete = async e => {
    await notificationStore.deleteNotification({
      notiId: item.id,
      type: item.type,
    });
  };

  const handleClick = async () => {
    if (!item.isRead)
      await notificationStore.readNotification({
        type: item.type,
        notiId: item.id,
      });

    // click시 아무동작도 하지 말아야할 조건이 모인 로직, true 일 경우, 아무동작도 수행하지 않음
    function isNotPassable() {
      // item이 roomId를 가지고있지 않은 경우, 해당 room이 존재하지 않는 경우
      if (!item.roomId || !roomStore.getRoom(item.roomId)) return true;

      const room = roomStore.getRoom(item.roomId);

      // 삭제된 방에서 온 것일 경우
      if (room.deleted) return true;

      // 탈퇴유저가 보낸 것일 경우
      const creatorId = item.createdBy;
      if (userStore[creatorId].isWithdrawn) return true;

      // 내가 없는 방에서 온 것일 경우
      const memberIdList = room.memberIdListString.split(',') || [];
      if (memberIdList.includes(userStore.myProfile.id)) return true;

      return false;
    }

    if (isNotPassable()) return;

    let routePath = `/s/${item.roomId}/talk`;
    switch (item.channelId) {
      case 'CHN0002 ': {
        const myId = userStore.myProfile.id;
        const { roomInfo } = roomStore.getDMRoom(myId, myId);
        if (roomInfo) routePath = `/m/${roomInfo.id}/mail`;
        break;
      }
      case 'CHN0003':
        routePath += '?sub=note';
        break;
      case 'CHN0005':
        routePath += '?sub=calendar';
        break;
      case 'CHN0006':
        routePath += '?sub=drive';
        break;
      default:
        break;
    }

    push(routePath);
    uiStore.isNotificationCenterVisible = false;
  };

  const getUserDisplayName = userId =>
    // displayName 없으면, 탈퇴한 멤버
    userStore.userProfiles[userId]?.displayName || t('CM_DEL_MEMBER_01');

  const getDateFormat = (timestamp, format) =>
    DateTime.fromFormat(timestamp, 'yyyy-MM-dd HH:mm:ss.S z').toFormat(format);

  const renderAppIcon = () => {
    const { color, icon } = APP_INFO[item.channelId];
    return <AppIconWrapper color={color}>{icon}</AppIconWrapper>;
  };

  const renderPhoto = roomId => {
    // 2개면 : push
    // 3개면 : push
    // 4개면 : replace
    const emptyImage =
      'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
    const srcList = roomStore.getRoomPhoto(roomId, 4);
    const { length } = srcList;
    if (length === 2 || length === 3) {
      srcList.push(emptyImage);
    } else if (length === 4) {
      srcList[length - 1] = emptyImage;
    }

    return (
      <PhotoWrapper>
        <Photos srcList={srcList} isClickable={false} defaultDiameter="2.625" />
        {renderAppIcon()}
      </PhotoWrapper>
    );
  };

  return useObserver(() => {
    return (
      <Wrapper style={style} isRead={item.isRead}>
        <InnerWrapper>
          {/* 사진 */}
          {renderPhoto(item.roomId)}

          <Description onClick={handleClick}>
            {/* 상단 */}
            <Row style={{ paddingRight: '1.25rem' }}>
              <Ellipsis>
                {item.type === 'mention' ? (
                  <MentionWrapper>
                    <BoldText style={{ marginRight: '0.25rem' }}>
                      {t('CM_NOTI_CENTER_02')}
                    </BoldText>
                    <MentionMessage noticeBody={item.bodyComponent} />
                  </MentionWrapper>
                ) : (
                  <NormalText>
                    <Trans
                      i18nKey={item.bodyKey}
                      components={{
                        style: <BoldText />,
                      }}
                      values={{
                        value: item.bodyValue || '(제목 없음)',
                      }}
                    />
                  </NormalText>
                )}
              </Ellipsis>
            </Row>

            {/* 하단 */}
            <Row>
              <Ellipsis>
                <LightText>{`by ${getUserDisplayName(
                  item.createdBy,
                )}`}</LightText>
              </Ellipsis>
              <LightText>{getDateFormat(item.createdAt, 'MM.dd')}</LightText>
            </Row>
          </Description>
          <IconWrapper onClick={handleDelete}>
            <CloseIcon width={0.75} height={0.75} fillColor="#6b6b6b" />
          </IconWrapper>
        </InnerWrapper>
      </Wrapper>
    );
  });
};

export default NotificationItem;

const InnerWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  height: 100%;
  border-bottom: 1px solid ${props => props.theme.LineSub};
`;

const AppIconWrapper = styled.div`
  position: absolute;
  right: 0;
  bottom: 0;
  background: ${({ color }) => color};
  border-radius: 50%;
  width: 1.375rem;
  height: 1.375rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Wrapper = styled.div`
  height: 4rem;
  padding: 0 1.188rem;
  opacity: ${({ isRead }) => (isRead ? '0.4' : '1')};
  &:last-child ${InnerWrapper} {
    border-bottom: 0;
  }
`;

const Description = styled.div`
  flex: 1;
  min-width: 0;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

const Ellipsis = styled.div`
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow-x: hidden;
`;

const MentionWrapper = styled.div`
  display: flex;
  align-items: center;

  & > div {
    display: flex;
    min-width: 0;

    & > p {
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow-x: hidden;
    }
  }
`;

const IconWrapper = styled.div`
  position: absolute;
  top: 0.75rem;
  right: 0;
  display: flex;
  padding: 0.25rem;
  justify-content: center;
  align-items: center;
  border-radius: 0.25rem;
  cursor: pointer;
  &:hover {
    background-color: ${props => props.theme.StateBright};
  }

  &:active {
    background-color: ${props => props.theme.StateDark};
  }
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const PhotoWrapper = styled.div`
  position: relative;
  margin-right: 0.75rem;
`;

const BoldText = styled.span`
  font-weight: bold;
  font-size: 0.813rem;
  color: ${props => props.theme.TextMain};
`;

const NormalText = styled.span`
  font-size: 0.75rem;
  color: ${props => props.theme.TextSub};
`;

const LightText = styled.span`
  font-size: 0.625rem;
  color: #aaaaaa;
  white-space: nowrap;
`;

const MentionMessage = styled(AlarmPlainMessage)`
  .message-emoji {
    width: 0.85rem;
    vertical-align: text-bottom;
  }
`;
