import React, { useCallback, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Observer } from 'mobx-react';
import styled from 'styled-components';
import { useCoreStores } from 'teespace-core';
import { WaplLogo, AddRoomIcon, OpenChatIcon, SearchIcon } from '../Icons';
import RoomItem from './RoomItem';
import OpenRoomHome from './OpenRoomHome';
import PlatformUIStore from '../../stores/PlatformUIStore';
import SelectRoomTypeDialog from './SelectRoomTypeDialog';
import RoomInquiryModal from './RoomInquiryModal';

function RoomList() {
  const history = useHistory();
  const [keyword, setKeyword] = useState('');
  const [openRoomVisible, setOpenRoomVisible] = useState(false);
  const [targetRoom, setTargetRoom] = useState(null);
  const { roomStore } = useCoreStores();

  const [visible, setVisible] = useState({
    selectRoomType: false,
  });

  const handleCreateRoom = () => {
    setVisible({ ...visible, selectRoomType: true });
  };

  const handleOpenChat = useCallback(() => {
    setOpenRoomVisible(r => !r);
  }, []);

  const handleSelectRoom = useCallback(roomInfo => {
    history.push({
      pathname: `/s/${roomInfo.id}/talk`,
      search: history.location.search,
    });
  }, []);

  const handleSearchUser = useCallback(() => {
    console.log('search user');
  }, []);

  const handleChange = useCallback(e => {
    setKeyword(e.target.value);
  }, []);

  const handleSelectRoomTypeCancel = () => {
    setVisible(false);
  };

  const handleRoomMemeberModalCancel = () => {
    PlatformUIStore.roomMemberModal.close();
  };

  const handleMenuClick = roomInfo => {
    setTargetRoom(roomInfo);
  };

  return (
    <Wrapper>
      <Observer>
        {() => {
          const modal = PlatformUIStore.roomMemberModal;

          return (
            <RoomInquiryModal
              roomId={targetRoom?.id}
              visible={modal.visible}
              onCancel={handleRoomMemeberModalCancel}
              width="17.5rem"
              top={modal.top}
              isEdit={modal.isEdit}
              left={modal.left}
            />
          );
        }}
      </Observer>

      <SelectRoomTypeDialog
        visible={visible.selectRoomType}
        onCancel={handleSelectRoomTypeCancel}
      />

      <TopWrapper>
        <InputWrapper>
          <SearchIcon width={1} height={1} color="rgb(133, 133, 133)" />
          <input
            type="text"
            value={keyword}
            onChange={handleChange}
            placeholder="룸 이름, 멤버 검색"
          />
        </InputWrapper>
        <OpenChatIconWrapper onClick={handleOpenChat}>
          <OpenChatIcon />
        </OpenChatIconWrapper>
        {openRoomVisible && (
          <OpenRoomHome
            handleOpenChat={handleOpenChat}
            handleSearchUser={handleSearchUser}
          />
        )}
      </TopWrapper>
      <RoomContainer>
        <Observer>
          {() =>
            roomStore
              .getRoomArray()
              .filter(roomInfo => roomInfo.isVisible)
              .map(roomInfo => (
                <RoomItem
                  key={roomInfo.id}
                  roomInfo={roomInfo}
                  selected={
                    PlatformUIStore.resourceType === 's' &&
                    PlatformUIStore.resourceId === roomInfo.id
                  }
                  onClick={handleSelectRoom}
                  onMenuClick={handleMenuClick}
                />
              ))
          }
        </Observer>
      </RoomContainer>
      <ButtomWrapper>
        <WaplLogo />

        <AddRoomIconWrapper onClick={handleCreateRoom}>
          <AddRoomIcon />
        </AddRoomIconWrapper>
      </ButtomWrapper>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: rgb(245, 245, 251);
  overflow-y: auto;
  height: 100%;
`;

const TopWrapper = styled.div`
  display: flex;
  padding: 0.5rem;
  & input {
    width: 100%;
  }
`;

const RoomContainer = styled.ul`
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

const InputWrapper = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  margin-right: 0.5rem;
  padding: 0 0.63rem;
  background: #fff;
  border-radius: 25px;
  border: 1px solid #e3e7eb;

  &:focus-within {
    border: 1px solid #6c56e5;
  }

  & input {
    margin-left: 0.44rem;
    height: 1.13rem;
    border: 0;

    :focus {
      outline: 0;
    }
  }
`;

const AddRoomIconWrapper = styled.div`
  display: flex;
  cursor: pointer;
  width: 2.5rem;
  height: 2.5rem;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  background: #232d3b;
  box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.2);
`;

const OpenChatIconWrapper = styled.div`
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 0 0 1.81rem;
  height: 1.81rem;
  border: 1px solid #e3e7eb;
  border-radius: 50%;
  background: #ffffff;
`;

const ButtomWrapper = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  padding: 0 0.69rem 0.75rem 0.94rem;
`;

export default RoomList;
