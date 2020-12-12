import React, { useCallback, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Observer } from 'mobx-react';
import styled from 'styled-components';
import { useCoreStores } from 'teespace-core';
import {
  WaplLogo,
  AddRoomIcon,
  OpenChatIcon,
  SearchIcon,
  EmptyRoomIllust,
} from '../Icons';
import RoomItem from './RoomItem';
import OpenRoomHome from './OpenRoomHome';
import PlatformUIStore from '../../stores/PlatformUIStore';
import SelectRoomTypeDialog from './SelectRoomTypeDialog';
import RoomInquiryModal from './RoomInquiryModal';

function RoomList() {
  const history = useHistory();
  const [keyword, setKeyword] = useState('');
  const [openRoomDialogVisible, setOpenRoomDialogVisible] = useState(false);
  const [targetRoom, setTargetRoom] = useState(null);
  const [isRoomMemberModalVisible, setIsRoomMemberModalVisible] = useState(
    false,
  );
  const { roomStore, userStore } = useCoreStores();

  const [visible, setVisible] = useState({
    selectRoomType: false,
  });

  const handleCreateRoom = () => {
    setVisible({ ...visible, selectRoomType: true });
  };

  const handleOpenChat = useCallback(() => {
    setOpenRoomDialogVisible(true);
  }, []);

  const handleSelectRoom = useCallback(roomInfo => {
    history.push({
      pathname: `/s/${roomInfo.id}/talk`,
      search: history.location.search,
    });
  }, []);

  const handleChange = useCallback(e => {
    setKeyword(e.target.value);
  }, []);

  const handleSelectRoomTypeCancel = () => {
    setVisible(false);
  };

  const handleRoomMemeberModalCancel = () => {
    setIsRoomMemberModalVisible(false);
  };

  const handleMenuClick = roomInfo => {
    setTargetRoom(roomInfo);
  };

  const handleOpenRoomModalCancel = () => {
    setOpenRoomDialogVisible(false);
  };

  const handleClickRoomPhoto = useCallback(roomInfo => {
    setTargetRoom(roomInfo);
    setIsRoomMemberModalVisible(true);
  }, []);

  const isOnlyMyRoom = () => {
    const rooms = roomStore
      .getRoomArray()
      .filter(roomInfo => roomInfo.isVisible);
    return rooms.length === 1 && rooms[0].type === 'WKS0001';
  };

  return (
    <Wrapper>
      <Observer>
        {() => {
          const modal = PlatformUIStore.roomMemberModal;

          return (
            <RoomInquiryModal
              roomId={targetRoom?.id}
              visible={isRoomMemberModalVisible}
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

        <OpenRoomHome
          visible={openRoomDialogVisible}
          onCancel={handleOpenRoomModalCancel}
        />
      </TopWrapper>
      <RoomContainer>
        <Observer>
          {() => {
            return roomStore
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
                  onClickRoomPhoto={handleClickRoomPhoto}
                />
              ));
          }}
        </Observer>
      </RoomContainer>
      <Observer>
        {() =>
          isOnlyMyRoom() ? (
            <div>
              <EmptyText
                style={{ fontSize: '0.94rem', marginBottom: '0.94rem' }}
              >
                <span> {`${userStore.myProfile.name}님, 환영합니다.`}</span>
                <span>룸을 만들어 보세요!</span>
              </EmptyText>
              <EmptyText
                style={{ fontSize: '0.75rem', marginBottom: '1.24rem' }}
              >
                <span>구성원들과 Talk 중심의</span>
                <span>다양한 앱을 경험 할 수 있습니다.</span>
              </EmptyText>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  marginBottom: '1rem',
                }}
              >
                <EmptyRoomIllust width={12.5} height={12.5} />
              </div>
            </div>
          ) : null
        }
      </Observer>
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

const EmptyText = styled.div`
  display: flex;
  flex-flow: wrap;
  justify-content: center;
  color: #523dc7;

  $ span {
    display: flex;
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
