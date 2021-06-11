import React from 'react';
import styled from 'styled-components';
import { useCoreStores } from 'teespace-core';

const NotificationItem = ({ style, item }) => {
  const { notificationStore } = useCoreStores();

  const handleClick = () => {
    console.log('Notification Click : ', item);
  };

  const handleDelete = () => {
    notificationStore.delete(item.type, item.id);
  };

  return (
    <Wrapper style={style} onClick={handleClick}>
      <InnerWrapper>
        {/* 사진 */}
        <Photo />

        <Description>
          {/* 상단 */}
          <Row>
            <Ellipsis>
              <BoldText>{item.typeTitle}</BoldText>
              <NormalText>{item.subTitle}</NormalText>
            </Ellipsis>
            <button type="button" onClick={handleDelete}>
              X
            </button>
          </Row>

          {/* 하단 */}
          <Row>
            <Ellipsis>
              <LightText>{item.createdBy}</LightText>
            </Ellipsis>
            <LightText>{item.createdAt}</LightText>
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

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Photo = styled.div`
  display: flex;
  flex: 0 0 3rem;
  height: 3rem;
  border-radius: 50%;
  background: skyblue;
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
`;
