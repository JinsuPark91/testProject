import React from 'react';
import { useHistory } from 'react-router-dom';
import { Observer } from 'mobx-react';
import { values } from 'mobx';
import styled from 'styled-components';
import { useCoreStores } from 'teespace-core';
import { SpaceIcon } from './Icons';
import RoomItem from './RoomItem';
import PlatformUIStore from '../stores/PlatformUIStore';

function RoomList() {
  const history = useHistory();
  const { roomStore } = useCoreStores();

  const handleRoomClick = roomInfo => {
    const { id } = roomInfo;
    PlatformUIStore.selectedRoom = roomInfo;
    history.push({
      pathname: `/s/${id}/talk`,
      search: history.location.search,
    });
  };

  return (
    <Wrapper>
      <Container>
        <Observer>
          {() =>
            values(roomStore.rooms).map(roomInfo => (
              <RoomItem
                key={roomInfo.id}
                underLine={false}
                roomInfo={roomInfo}
                selected={roomInfo.id === PlatformUIStore.selectedRoom?.id}
                onClick={() => {
                  handleRoomClick(roomInfo);
                }}
              />
            ))
          }
        </Observer>
      </Container>

      <CreateRoomButton>
        <SpaceIcon />
        <span style={{ marginLeft: '0.3125rem', fontWeight: '500' }}>
          룸 만들기
        </span>
      </CreateRoomButton>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  overflow-y: auto;
  height: 100%;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  height: calc(100% - 2.5rem);
`;

const CreateRoomButton = styled.div`
  display: flex;
  align-self: center;
  justify-content: center;
  align-items: center;
  height: 2.5rem;
  background: #ffffff;
  border: 0.0625rem solid #5a5fff;
  border-radius: 1.875rem;
  color: #5a5fff;
  font-size: 0.81rem;
  margin: 0.625rem;
  box-sizing: border-box;
  width: fill-available;
  z-index: 1;

  &:hover {
    background-color: #dcddff;
    border: 0.0625rem solid #c6ced6;
    cursor: pointer;
  }
`;

export default RoomList;
