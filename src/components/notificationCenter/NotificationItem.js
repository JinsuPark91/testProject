import React from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { useCoreStores, Icons } from 'teespace-core';
import { Trans } from 'react-i18next';
import { useStores } from '../../stores';
import Photos from '../Photos';

const { CloseIcon } = Icons;

const NotificationItem = ({ style, item }) => {
  const { push } = useHistory();
  const { notificationStore, roomStore } = useCoreStores();
  const { uiStore } = useStores();
  // const content = JSON.parse(item.content);

  const handleClick = () => {
    console.log('ITEM CLICK!! : ', item);
    push(`/s/${item.roomId}/talk`);
    uiStore.isNotificationCenterVisible = false;
  };

  const handleDelete = e => {
    e.stopPropagation();
    console.log('ITEM DELETE!! : ', item);
    notificationStore.delete(item.type, item.id);
  };

  return (
    <Wrapper style={style} onClick={handleClick}>
      <InnerWrapper>
        {/* 사진 */}
        <PhotoWrapper>
          <Photos
            srcList={roomStore.getRoomPhoto(item.roomId, 4)}
            defaultDiameter="2.625"
          />
        </PhotoWrapper>

        <Description>
          {/* 상단 */}
          <Row>
            <Ellipsis>
              <BoldText>{item.notificationBody}</BoldText>
              {/* <NormalText>
                <Trans
                  i18nKey={content.key}
                  components={{
                    style: <BoldText />,
                  }}
                  values={{
                    value: content.value,
                  }}
                />
              </NormalText> */}
            </Ellipsis>

            <IconWrapper>
              <CloseIcon
                width={0.75}
                height={0.75}
                fillColor="#6b6b6b"
                onClick={handleDelete}
              />
            </IconWrapper>
          </Row>

          {/* 하단 */}
          <Row>
            <Ellipsis>
              <LightText>{item.regiUserId}</LightText>
            </Ellipsis>
            <LightText>{item.regiDate}</LightText>
          </Row>
        </Description>
      </InnerWrapper>
    </Wrapper>
  );
};

export default NotificationItem;

const Wrapper = styled.div`
  height: 4rem;
  padding: 0 1.188rem;
  cursor: pointer;
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

const BoldText = styled.span`
  font-weight: bold;
  font-size: 0.813rem;
  color: #000000;
`;

const NormalText = styled.span`
  font-size: 0.75rem;
  color: #666666;
`;

const LightText = styled.span`
  font-size: 0.625rem;
  color: #aaaaaa;
  white-space: nowrap;
`;
