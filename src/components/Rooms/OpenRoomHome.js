import React, { useState, useCallback, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { Modal } from 'antd';
import { talkRoomStore } from 'teespace-talk-app';
import { useCoreStores, Message, logEvent } from 'teespace-core';
import { Observer } from 'mobx-react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Photos from '../Photos';
import NextArrowIcon from '../../assets/arrow_right_line.svg';
import PrevArrowIcon from '../../assets/arrow_left_line.svg';
import { SettingIcon, OpenChatIcon, AddIcon } from '../Icons';
import CreatePublicRoomDialog from '../dialogs/CreatePublicRoomDialog';
import { getQueryParams, getQueryString } from '../../utils/UrlUtil';
import Search from '../common/Search';

const RoomButton = ({ roomInfo, onClick, disabled }) => {
  const handleClick = () => {
    onClick(roomInfo);
  };

  return (
    <RoomJoinBtn onClick={handleClick} disabled={disabled}>
      <span>방 참여하기</span>
      <OpenChatIcon width={1} height={1} color="#75757f" />
    </RoomJoinBtn>
  );
};

const OpenRoomItem = ({ roomInfo, photo, onClick, onSettingClick }) => {
  const handleClick = () => {
    onClick(roomInfo);
  };

  const handleSetting = e => {
    e.stopPropagation();
    onSettingClick(roomInfo);
  };

  return (
    <div
      onClick={handleClick}
      style={{ cursor: 'pointer', position: 'relative' }}
    >
      <IconWrapper onClick={handleSetting}>
        <SettingIcon width={0.75} height={0.75} color="rgb(120,120,129)" />
      </IconWrapper>
      <Photos srcList={photo} defaultDiameter="3.75" />
      <OpenRoomName style={{ width: '3.75rem' }}>
        <Observer>{() => roomInfo.customName || roomInfo.name}</Observer>
      </OpenRoomName>
    </div>
  );
};

function OpenRoomHome({ visible, onCancel }) {
  const initialStates = {
    createModalVisible: false,
    enterModalVisible: false,
    keyword: '',
    currentOpenRoom: null,
  };

  const [createModalVisible, setCreateModalVisibie] = useState(
    initialStates.createModalVisible,
  );
  const [enterModalVisible, setEnterModalVisible] = useState(
    initialStates.enterModalVisible,
  );
  const [keyword, setKeyword] = useState(initialStates.keyword);
  const [currentOpenRoom, setCurrentOpenRoom] = useState(
    initialStates.currentOpenRoom,
  );

  const { roomStore, userStore } = useCoreStores();
  const history = useHistory();

  useEffect(() => {
    if (visible) {
      const fetchOpenRoomList = async () => {
        const res = await roomStore.fetchOpenRoomList(userStore.myProfile.id);
        return res;
      };

      const fetchRecommandOpenRoomList = async () => {
        const res = await roomStore.fetchRecommandRoomList(
          userStore.myProfile.id,
        );
        return res;
      };

      Promise.all([fetchOpenRoomList(), fetchRecommandOpenRoomList()]);
    }
  }, [visible]);

  const clearState = () => {
    setCreateModalVisibie(initialStates.createModalVisible);
    setKeyword(initialStates.keyword);
    setEnterModalVisible(initialStates.enterModalVisible);
    setCurrentOpenRoom(initialStates.currentOpenRoom);
  };

  const closeHomeModal = () => {
    clearState();
    onCancel();
  };

  const openCreateModel = () => {
    setCreateModalVisibie(true);
  };

  const closeCreateModal = () => {
    setCreateModalVisibie(false);
  };

  const openEnterModal = () => {
    setEnterModalVisible(true);
  };

  const closeEnterModal = () => {
    setEnterModalVisible(false);
  };

  const handleCreateRoom = useCallback(() => {
    openCreateModel();
  }, []);

  const handleKeywordChange = value => {
    setKeyword(value);
  };

  const handleKeywordClear = () => {
    setKeyword(initialStates.keyword);
  };

  const handleJoin = async roomInfo => {
    setCurrentOpenRoom(roomInfo);
    if (roomInfo.isJoined) {
      history.push(`/s/${roomInfo.id}/talk`);
      closeHomeModal();
    } else {
      openEnterModal();
    }
  };

  const handleRoomClick = roomInfo => {
    closeHomeModal();
    history.push(`/s/${roomInfo.id}/talk`);
  };

  const handleSettingClick = roomInfo => {
    closeHomeModal();
    history.push(`/s/${roomInfo.id}/setting`);
  };

  const getUserPhotos = memberString => {
    return memberString
      .split(',')
      .splice(0, 4)
      .map(userId => `${userStore.getProfilePhotoURL(userId, 'small')}`);
  };

  // Public Room
  const handleCreatePublicRoomOk = async ({
    roomName,
    selectedUsers,
    isStartMeeting,
  }) => {
    const data = {
      name: roomName,
      creatorId: userStore.myProfile.id,
      userList: selectedUsers.map(user => ({
        userId: user.friendId || user.id,
      })),
      type: 'open',
    };

    closeHomeModal();
    closeCreateModal();

    const { roomId } = await roomStore.createRoom(data);

    await talkRoomStore.initialize(userStore.myProfile.id, roomId);

    const queryParams = { ...getQueryParams() };
    if (isStartMeeting) {
      queryParams.sub = 'meeting';
    }
    const queryString = getQueryString(queryParams);
    history.push(`/s/${roomId}/talk?${queryString}`);
  };

  const handleCreatePublicRoomCancel = () => {
    closeCreateModal();
  };

  const handleConfirmEnter = async () => {
    const myUserId = userStore.myProfile.id;
    try {
      const res = await roomStore.enterRoom({
        myUserId,
        roomId: currentOpenRoom.id,
      });

      if (res?.roomId) {
        history.push(`/s/${currentOpenRoom.id}/talk`);
      }
      logEvent('room', 'clickEnterOpenRoomBtn');
    } catch (err) {
      console.error('ROOM ENTER ERROR : ', err);
    }

    closeEnterModal();
    closeHomeModal();
  };

  const handleCancelEnter = () => {
    closeEnterModal();
  };

  const getRoomItems = searchKeyword => {
    const rooms = roomStore
      .getOpenRoomArray()
      .filter(
        roomInfo =>
          roomInfo.name.includes(searchKeyword) ||
          roomInfo.adminName.includes(searchKeyword),
      );

    if (rooms.length) {
      return rooms.map(roomInfo => {
        return (
          <RoomListItem key={roomInfo.id}>
            <div style={{ flex: '0 0 2.26rem', marginRight: '0.63rem' }}>
              <Photos
                srcList={getUserPhotos(roomInfo.memberIdListString)}
                defaultDiameter="1.75"
              />
            </div>
            <Observer>
              {() => (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    minWidth: 0,
                    whiteSpace: 'nowrap',
                    flex: 1,
                  }}
                >
                  <RecomRoomTitle>
                    {roomInfo.customName || roomInfo.name}
                  </RecomRoomTitle>
                  <AdminText>{`관리자 ${roomInfo.adminName}`}</AdminText>
                </div>
              )}
            </Observer>

            <JoinedText>{roomInfo.isJoined ? '(참여 중)' : ''}</JoinedText>
            <RoomButton roomInfo={roomInfo} onClick={handleJoin} />
          </RoomListItem>
        );
      });
    }

    return (
      <RoomSearchForm>
        <SearchTitle>{keyword}</SearchTitle>
        <SearchSubText>검색 결과가 없습니다.</SearchSubText>
      </RoomSearchForm>
    );
  };

  return (
    <>
      {currentOpenRoom && (
        <Message
          visible={enterModalVisible}
          title={currentOpenRoom.name}
          subtitle="오픈 룸에 참여하시겠습니까?"
          type="custom"
          customBadge={
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Photos
                srcList={getUserPhotos(currentOpenRoom.memberIdListString)}
                defaultDiameter="2.26"
              />
            </div>
          }
          btns={[
            {
              type: 'solid',
              shape: 'round',
              text: '참여',
              onClick: handleConfirmEnter,
            },
            {
              type: 'outlined',
              shape: 'round',
              text: '취소',
              onClick: handleCancelEnter,
            },
          ]}
        />
      )}
      <CreatePublicRoomDialog
        visible={createModalVisible}
        onOk={handleCreatePublicRoomOk}
        onCancel={handleCreatePublicRoomCancel}
      />
      <StyledModal
        title="오픈 룸 홈"
        visible={visible}
        mask={false}
        footer={false}
        onCancel={closeHomeModal}
        width="100%"
        destroyOnClose
        style={{
          display: 'flex',
          justifyContent: 'center',
          margin: 'unset',
        }}
      >
        <OpenHomeForm>
          <Search
            placeholder="전체 검색"
            onChange={handleKeywordChange}
            onClear={handleKeywordClear}
            searchIconColor={{ active: '#48423B', default: '#48423B' }}
            type="border"
          />
          {!keyword ? (
            <>
              <RoomListBox>
                <Observer>
                  {() => {
                    const openRooms = roomStore
                      .getOpenRoomArray()
                      .filter(
                        roomInfo =>
                          roomInfo.adminId === userStore.myProfile.id &&
                          roomInfo.isJoined,
                      );

                    const remain = (openRooms.length + 1) % 4;
                    const dummyArray = Array.from(
                      Array(remain ? 4 - remain : 0).keys(),
                    );

                    return (
                      <>
                        <RoomTitle>
                          내 오픈 룸 목록
                          <RoomCount>{openRooms.length}</RoomCount>
                        </RoomTitle>
                        <StyledSlider
                          arrows
                          initialSlide={0}
                          slidesToShow={4}
                          slidesToScroll={4}
                        >
                          <ItemAddBtn onClick={handleCreateRoom}>
                            <span>오픈룸 생성</span>
                            <AddIcon
                              width="1.25"
                              height="1.25"
                              color="#7B7671"
                            />
                          </ItemAddBtn>
                          {openRooms.map(openRoom => {
                            return (
                              <OpenRoomItem
                                key={openRoom.id}
                                roomInfo={openRoom}
                                photo={getUserPhotos(
                                  openRoom.memberIdListString,
                                )}
                                onClick={handleRoomClick}
                                onSettingClick={handleSettingClick}
                              />
                            );
                          })}
                          {dummyArray.map(key => {
                            return <div key={key} />;
                          })}
                        </StyledSlider>
                      </>
                    );
                  }}
                </Observer>
              </RoomListBox>
              <RecommendRoomListBox>
                <RoomOpenTitle>추천 오픈 룸</RoomOpenTitle>
                <Observer>
                  {() => (
                    <RoomList>
                      {roomStore.getRecommandRoomArray().map(roomInfo => (
                        <RoomListItem key={roomInfo.id}>
                          <OpenRoomPhotos
                            srcList={getUserPhotos(roomInfo.memberIdListString)}
                            defaultDiameter="2.26"
                          />
                          <RecomRoomTitle
                            style={{
                              flex: 1,
                              marginLeft: '0.38rem',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {roomInfo.customName || roomInfo.name}
                          </RecomRoomTitle>
                          <JoinedText>
                            {roomInfo.isJoined ? '(참여 중)' : ''}
                          </JoinedText>
                          <RoomButton
                            roomInfo={roomInfo}
                            onClick={handleJoin}
                            disabled={roomInfo.isJoined}
                          />
                        </RoomListItem>
                      ))}
                    </RoomList>
                  )}
                </Observer>
              </RecommendRoomListBox>
            </>
          ) : (
            <RecommendRoomListBox>
              <RoomList>{getRoomItems(keyword)}</RoomList>
            </RecommendRoomListBox>
          )}
        </OpenHomeForm>
      </StyledModal>
    </>
  );
}

const StyledModal = styled(Modal)`
  .ant-modal-body {
    padding: 0;
  }

  .ant-modal-content {
    width: 24.38rem;
  }
`;
const OpenHomeForm = styled.div`
  display: flex;
  flex-direction: column;
  height: 29.75rem;
  padding: 0.63rem 0.94rem;
`;

const JoinedText = styled.div`
  padding: 0 0.5rem;
  font-size: 0.69rem;
  color: #696969;
  white-space: nowrap;
`;

const OpenRoomName = styled.div`
  overflow: hidden;
  width: 3.75rem;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: center;
`;

const RoomListBox = styled.div`
  padding: 0.94rem 0 0.75rem;
  border-bottom: 1px solid #eeedeb;
`;

const RecommendRoomListBox = styled.div`
  overflow: hidden;
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 0.94rem 0 0.63rem;
`;

const RoomList = styled.ul`
  overflow-y: auto;
  height: 100%;
  padding: 0 0.38rem 0 0.63rem;
`;

const RoomListItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.63rem 0;
`;

const RoomTitle = styled.p`
  font-size: 0.75rem;
  font-weight: 500;
  line-height: 1.13rem;
  color: #000;
`;

const RoomOpenTitle = styled(RoomTitle)`
  padding-bottom: 0.63rem;
`;

const RoomCount = styled.span`
  color: #000;
  opacity: 0.5;
  font-size: 0.75rem;
  margin-left: 0.5rem;
`;

const ItemAddBtn = styled.button`
  position: relative;
  width: 3.75rem !important;
  height: 3.75rem;
  margin: 0 auto;
  border-radius: 50%;
  background-color: #f7f4ef;
  border: none;
  vertical-align: top;
  font-size: 0;
  line-height: 0;
  text-indent: -9999px;
  cursor: pointer;

  svg {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
`;
const RoomSearchForm = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-self: center;
  justify-self: center;
  justify-content: center;
  flex-direction: column;
`;
const RecomRoomTitle = styled.p`
  font-size: 0.81rem;
  color: #000000;
  letter-spacing: 0;
  overflow-x: hidden;
  text-overflow: ellipsis;
`;

const AdminText = styled.p`
  color: #696969;
  overflow-x: hidden;
  text-overflow: ellipsis;
  font-size: 0.63rem;
`;

const SearchTitle = styled.p`
  font-weight: 500;
  font-size: 0.94rem;
  color: #000000;
  letter-spacing: 0;
  text-align: center;
  margin-bottom: 0.63rem;
`;

const SearchSubText = styled.p`
  font-weight: 400;
  font-size: 0.75rem;
  color: #696969;
  letter-spacing: 0;
  text-align: center;
`;

const RoomJoinBtn = styled.button`
  opacity: ${({ disabled }) => (disabled ? '0.4' : '1')};
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  padding: 0.25rem;
  line-height: 0;
  background-color: transparent;
  border: none;
  border-radius: 0.25rem;

  &:hover {
    background-color: #f2efec;
  }

  span {
    font-size: 0;
    line-height: 0;
    text-indent: -9999px;
    vertical-align: top;
  }
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: -0.375rem;
  right: -0.375rem;
  width: 1.25rem;
  height: 1.25rem;
  background: #efefef;
  border-radius: 50%;
  z-index: 1;

  &:hover {
    background: #ccc;
  }
`;

const StyledSlider = styled(Slider)`
  margin-top: 0.75rem;
  .slick-slide {
    padding-top: 0.375rem;
    & > div {
      text-align: center;
      & > div {
        width: fit-content;
        margin: 0 auto;
      }
    }
  }
  .slick-prev,
  .slick-next {
    width: 1rem;
    height: 1rem;
    top: -1.61rem;
    &:before {
      content: '';
      display: inline-block;
      width: 1rem;
      height: 1rem;
      background-size: contain;
      background-repeat: no-repeat;
    }
  }
  .slick-prev {
    left: unset;
    right: 1.5rem;
    &:before {
      background-image: url(${PrevArrowIcon});
    }
  }
  .slick-next {
    right: 0;
    &:before {
      background-image: url(${NextArrowIcon});
    }
  }
`;

const OpenRoomPhotos = styled(Photos)`
  cursor: default;
`;

export default OpenRoomHome;
