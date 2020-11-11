import React, { useCallback, useMemo } from 'react';
import { List } from 'antd';
import styled, { css } from 'styled-components';
import { Observer } from 'mobx-react';
import Photos from './Photos';

const { Item } = List;

const RoomItem = ({ roomInfo, underLine, selected, onClick }) => {
  const thumbs = [
    'https://w.namu.la/s/f5ebe7f90296e3147f623f79083cf4487d82549ada2b5c022fae52c794009a31bccc8972f5aebe70d95edf52cec56a9681e6b33764cf22d5cfb380bacfd1cc22526e6de9e8bf99f658c761da4ccc545dd942c0f38dd11d91fe98558c68335488',
    'https://w.namu.la/s/ac4e43dffb27074a0e00149053c9121d1f23da8865d58a4cf942f9227270664358ac17e2244d1e9f20f4fd57cddcbff4aaa5be427ce2db3640ae3736815338ca8ba7bf58f062446c05f205a3fcbc9ddc4771a3b046662b66138069d3804a9fb6',
    'https://w.namu.la/s/aa021c62d70f9f4a21e3b25adf4bf5cac54073fb0ae1620cc67c668be226a0f63a35da80f8c2552a7bd92ab3a8fdf0f76cc0cff470579d51c94236b34a1438ff1050f62581bbf341ec817ad3002f1c4bdc6cf9780458304dc72269965d068791',
  ];

  const handleRoomClick = useCallback(() => {
    onClick(roomInfo);
  }, []);

  const content = useMemo(() => {
    return (
      <>
        <Item.Meta
          avatar={<Photos srcList={thumbs} maxCount={4} />}
          title={
            <Title>
              <Observer>
                {() => <RoomNameText>{roomInfo.name}</RoomNameText>}
              </Observer>
              <Observer>
                {() => <UserCountText>{roomInfo.userCount}</UserCountText>}
              </Observer>
            </Title>
          }
          description={
            <StyleRoomMessage>{roomInfo.userCount}</StyleRoomMessage>
          }
        />

        <UnreadCount>unread count</UnreadCount>
      </>
    );
  }, []);

  return (
    // selected 가 바뀌면 자식 전부를 새로그린다.
    // content를 memo 해두고 쓰자
    <Wrapper underLine={underLine} onClick={handleRoomClick}>
      <StyledItem selected={selected}>{content}</StyledItem>
    </Wrapper>
  );
};

const Title = styled.div`
  display: flex;
  font-size: 0.8125rem;
`;

const StyleRoomMessage = styled.span`
  font-size: 0.6875rem;
  line-height: 1.063rem;
  color: #47474d;
  letter-spacing: 0;
`;

const RoomNameText = styled.span`
  font-weight: 500;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;

const UserCountText = styled.span`
  opacity: 0.5;
  color: #000000;
  margin-left: 0.375rem;
`;

const Wrapper = styled.div`
  ${({ underLine }) =>
    underLine &&
    css`
      border-bottom: 0.0625rem solid #e3e7eb;
    `}
`;

const StyledItem = styled(Item)`
  padding: 0.625rem;
  user-select: none;
  cursor: pointer;
  border-radius: 1.875rem;

  ${({ selected }) =>
    selected &&
    css`
      background: #e2e3fb;
    `}

  & .ant-list-item-meta-avatar {
    margin-right: 0.3125rem;
  }

  & .ant-list-item-meta-content {
    margin-right: 0.625rem;
  }

  & button {
    display: none;
  }

  & .ant-list-item-meta-title {
    margin: 0;
    line-height: 1.188rem;
  }
  & .ant-list-item-meta-description {
    font-size: 0.6875rem;
    color: #47474d;
    line-height: 1.063rem;
  }

  &:hover {
    background: #eaeafb;
  }
`;

const UnreadCount = styled.div`
  width: 1.5rem;
  background-color: #ff486d;
  padding: 0 0.125rem 0 0.1875rem;
  color: #fff;
  text-align: center;
  font-weight: 400;
  line-height: 0.9375rem;
  font-size: 0.63rem;
  padding: 0 0.3125rem;
  border-radius: 0.625rem;
`;

export default RoomItem;
