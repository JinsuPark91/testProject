import React from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { useCoreStores, Icons } from 'teespace-core';
import { AlarmPlainMessage } from 'teespace-talk-app';
import { Trans } from 'react-i18next';
import { useObserver } from 'mobx-react';
import { DateTime } from 'luxon';
import { useStores } from '../../stores';
import Photos from '../Photos';

const { CloseIcon } = Icons;

const NotificationItem = ({ style, item }) => {
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

    if (!item.roomId) return;
    push(`/s/${item.roomId}/talk`);
    uiStore.isNotificationCenterVisible = false;
  };

  const getUserDisplayName = userId =>
    userStore.userProfiles[userId].displayName;

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

        <Description>
          {/* 상단 */}
          <Row>
            <Ellipsis>
              <NormalText onClick={handleClick}>
                {item.type === 'mention' ? (
                  <MentionMessage noticeBody={item.bodyComponent} />
                ) : (
                  <Trans
                    i18nKey={item.bodyKey}
                    components={{
                      style: <BoldText />,
                    }}
                    values={{
                      value: item.bodyValue,
                    }}
                  />
                )}
              </NormalText>
            </Ellipsis>

            <IconWrapper onClick={handleDelete}>
              <CloseIcon width={0.75} height={0.75} fillColor="#6b6b6b" />
            </IconWrapper>
          </Row>

          {/* 하단 */}
          <Row>
            <Ellipsis>
              <LightText onClick={handleClick}>{`by ${getUserDisplayName(
                item.createdBy,
              )}`}</LightText>
            </Ellipsis>
            <LightText onClick={handleClick}>
              {getDateFormat(item.createdAt, 'MM.dd')}
            </LightText>
          </Row>
        </Description>
      </InnerWrapper>
    </Wrapper>
  ));
};

export default NotificationItem;

const Wrapper = styled.div`
  height: 4rem;
  padding: 0 1.188rem;
  opacity: ${({ isRead }) => (isRead ? '0.4' : '1')};
`;

const InnerWrapper = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
  border-bottom: 1px solid #eeedeb;
`;

const Description = styled.div`
  flex: 1;
  min-width: 0;
`;

const Ellipsis = styled.div`
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow-x: hidden;
`;

const IconWrapper = styled.div`
  display: flex;
  flex: 0 0 1rem;
  height: 1rem;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  cursor: pointer;
  &:hover {
    background-color: #faf8f7;
  }

  &:active {
    background-color: #f2efec;
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

const UnderLineText = styled.span`
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

const BoldText = styled(UnderLineText)`
  font-weight: bold;
  font-size: 0.813rem;
  color: #000000;
`;

const NormalText = styled(UnderLineText)`
  font-size: 0.75rem;
  color: #666666;
`;

const LightText = styled(UnderLineText)`
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
