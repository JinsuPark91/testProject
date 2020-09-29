import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroller';
import { List } from 'antd';
import styled from 'styled-components';
import { useCoreStores, API } from 'teespace-core';

const { Item } = List;

// TODO : 사진 배치 귀찮
function Photos({ srcList, maxCount }) {
  const srcs = srcList.slice(0, maxCount);
  const width = 30;

  return (
    <PhotoWrapper>
      {srcs.map((src, index) => (
        //   TODO : key 바꿀것 (사진 ID)
        <UserPhoto
          key={index}
          src={src}
          width={width}
          left={index * 5}
          top={index * 5}
        />
      ))}
    </PhotoWrapper>
  );
}

function RoomItem({ roomInfo, onClick }) {
  const {
    UID_LIST: roomName,
    MSG_BODY: lastMessage,
    UNREAD_USER_COUNT: unreadCount,
  } = roomInfo;

  const handleMoreMenuClick = () => {
    console.log('MORE : ', roomInfo);
  };

  const handleNewWindowClick = () => {
    console.log('NEW WINDOW : ', roomInfo);
  };

  return (
    <StyledItem onClick={onClick}>
      <Item.Meta
        avatar={
          <Photos
            srcList={[
              'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
              'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
              'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
              'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
            ]}
            maxCount={3}
          />
        }
        title={`${roomName}${roomName}${roomName}`}
        description={`${lastMessage}${lastMessage}${lastMessage}`}
      />
      {unreadCount * 1 ? (
        <UnreadCount className="room-item__unread-count">
          {unreadCount}
        </UnreadCount>
      ) : null}

      <button type="button" onClick={handleMoreMenuClick}>
        ...
      </button>
      <button type="button" onClick={handleNewWindowClick}>
        o
      </button>
    </StyledItem>
  );
}

const TEMP_USER_ID = 'd404f9aa-c9db-4b21-8911-c1305c46b5f7';

function RoomList() {
  const [hasMore, setHasMore] = useState(false);
  const [roomList, setRoomList] = useState([]);
  const history = useHistory();
  const params = useParams();
  const { roomStore, authStore } = useCoreStores();
  console.log(history, params);

  useEffect(() => {
    async function getRooms() {
      const { data } = await API.Get(
        `/Messenger/ttalkmessengers?action=List&user-id=${TEMP_USER_ID}&istemp=false&show=true`,
      );
      setRoomList(data.dto.ttalkMessengersList);
    }

    getRooms();
  }, []);

  const handleInfiniteOnLoad = () => {
    // TODO : 무한스크롤 적용할거면 구현 하자.
  };

  const handleRoomClick = roomInfo => {
    const { CH_ID: roomId } = roomInfo;
    history.push({
      pathname: `/${params['0']}/${roomId}/${params.mainApp}`,
      search: history.location.search,
    });
  };

  return (
    <Wrapper>
      <InfiniteScroll
        initialLoad={false}
        pageStart={0}
        loadMore={handleInfiniteOnLoad}
        hasMore={hasMore}
        loader={null}
        useWindow={false}
      >
        <List
          itemLayout="horizontal"
          dataSource={roomList}
          renderItem={item => (
            <RoomItem
              roomInfo={item}
              onClick={() => {
                handleRoomClick(item);
              }}
            />
          )}
        />
      </InfiniteScroll>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  overflow-y: auto;
  height: 100%;
`;

const StyledItem = styled(Item)`
  padding: 10px;
  user-select: none;
  cursor: pointer;

  & .ant-list-item-meta-avatar {
    margin-right: 5px;
  }

  & .ant-list-item-meta-content {
    margin-right: 10px;
  }

  & button {
    display: none;
  }

  &:hover {
    background: #eaeafb;
    border-radius: 20px;
  }

  &:hover .room-item__unread-count {
    display: none;
  }

  &:hover button {
    display: block;
  }
`;

const UnreadCount = styled.div`
  background: red;
  color: white;
  font-size: 13px;
  font-weight: 800;
  padding: 0 5px;
  border-radius: 10px;
`;

const PhotoWrapper = styled.div`
  width: 45px;
  height: 45px;
  position: relative;
`;

const UserPhoto = styled.img`
  width: ${props => props.width}px;
  left: ${props => props.left}px;
  top: ${props => props.top}px;
  position: absolute;
  background: white;
  border-radius: 50%;
`;

export default RoomList;
