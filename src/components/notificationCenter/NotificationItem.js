import React from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { useCoreStores, Icons } from 'teespace-core';
import { AlarmPlainMessage } from 'teespace-talk-app';
import { Trans, useTranslation } from 'react-i18next';
import { useObserver } from 'mobx-react';
import { DateTime } from 'luxon';
import { LeftCircleFilled } from '@ant-design/icons';
import { useStores } from '../../stores';

import Photos from '../Photos';

const { CloseIcon } = Icons;

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

    if (!item.roomId || !roomStore.getRoom(item.roomId)) return;

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
    userStore.userProfiles[userId]?.displayName || '(탈퇴한 멤버)';

  const getDateFormat = (timestamp, format) =>
    DateTime.fromFormat(timestamp, 'yyyy-MM-dd HH:mm:ss.S z').toFormat(format);

  return useObserver(() => (
    <Wrapper style={style} isRead={item.isRead}>
      <InnerWrapper>
        {/* 사진 */}
        <PhotoWrapper>
          <Photos
            srcList={roomStore.getRoomPhoto(item.roomId, 4)}
            isClickable={false}
            defaultDiameter="2.625"
          />
        </PhotoWrapper>

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
  ));
};

export default NotificationItem;

const InnerWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  height: 100%;
  border-bottom: 1px solid ${props => props.theme.LineSub};
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
