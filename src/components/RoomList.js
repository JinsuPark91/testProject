import React, { useCallback, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Observer } from 'mobx-react';
import { values, toJS } from 'mobx';
import styled from 'styled-components';
import { useCoreStores } from 'teespace-core';
import { SpaceIcon } from './Icons';
import RoomItem from './RoomItem';
import PlatformUIStore from '../stores/PlatformUIStore';

function RoomList() {
  const history = useHistory();
  const [keyword, setKeyword] = useState('');
  const { roomStore } = useCoreStores();

  const handleSelectRoom = useCallback(roomInfo => {
    history.push({
      pathname: `/s/${roomInfo.id}/talk`,
      search: history.location.search,
    });
  }, []);

  const handleChange = useCallback(e => {
    setKeyword(e.target.value);
  }, []);

  return (
    <Wrapper>
      <SearchWrapper>
        <input
          type="text"
          value={keyword}
          onChange={handleChange}
          placeholder="룸 이름, 멤버 검색"
        />
      </SearchWrapper>
      <Container>
        <Observer>
          {() =>
            values(roomStore.rooms)
              .filter(
                roomInfo =>
                  roomInfo.name.includes(keyword) ||
                  roomInfo.type === 'WKS0001',
              )
              .map(roomInfo => (
                <RoomItem
                  key={roomInfo.id}
                  roomInfo={roomInfo}
                  selected={
                    PlatformUIStore.resourceType === 's' &&
                    PlatformUIStore.resourceId === roomInfo.id
                  }
                  onClick={handleSelectRoom}
                />
              ))
          }
        </Observer>
      </Container>

      <CreateRoomButton>
        <SpaceIcon />
        <span
          style={{ marginLeft: '0.3125rem', fontWeight: '500' }}
          onClick={() => {
            values(roomStore.rooms)[0].name = 'test!!';
            values(roomStore.rooms)[0].userCount = 30;
          }}
        >
          룸 만들기
        </span>
      </CreateRoomButton>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow-y: auto;
  height: 100%;
`;

const SearchWrapper = styled.div`
  padding: 0.5rem;
  & input {
    width: 100%;
  }
`;

const Container = styled.ul`
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: hidden;
  height: calc(100% - 2.5rem);
  list-style-type: none;
  margin-block-start: 0;
  margin-block-end: 0;
  margin-inline-start: 0;
  margin-inline-end: 0;
  padding-inline-start: 0;
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
