import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { List } from 'antd';
import styled from 'styled-components';
import { API, useCoreStores } from 'teespace-core';
// import { talkRoomStore } from 'teespace-talk-app';
import RoomItem from './RoomItem';

function RoomList() {
  const [roomList, setRoomList] = useState([]);
  const { authStore } = useCoreStores();
  const history = useHistory();
  const params = useParams();

  useEffect(() => {
    // async function getRooms() {
    //   const rooms = await talkRoomStore.getRoomList(authStore.myInfo.id);
    //   setRoomList(rooms);
    // }
    // getRooms();
  }, [authStore.myInfo.id]);

  const handleRoomClick = roomInfo => {
    const { WS_ID: roomId } = roomInfo;
    history.push({
      pathname: `/${params['0']}/${roomId}/${params.mainApp}`,
      search: history.location.search,
    });
  };

  return (
    <Wrapper>
      <List
        itemLayout="horizontal"
        dataSource={roomList}
        renderItem={item => {
          return (
            <RoomItem
              roomInfo={item}
              onClick={() => {
                handleRoomClick(item);
              }}
            />
          );
        }}
      />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  overflow-y: auto;
  height: 100%;
`;

export default RoomList;
