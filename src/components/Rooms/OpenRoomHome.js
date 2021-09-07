import React, { useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import styled, { ThemeContext } from 'styled-components';
// import { Modal } from 'antd';
import { useCoreStores, logEvent, Modal } from 'teespace-core';
import { Observer, useLocalStore } from 'mobx-react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useTranslation, Trans } from 'react-i18next';
import { transaction } from 'mobx';
import Photos from '../Photos';
import NextArrowIcon from '../../assets/arrow_right_line.svg';
import PrevArrowIcon from '../../assets/arrow_left_line.svg';
import { SettingIcon, OpenChatIcon, AddIcon } from '../Icons';
import CreatePublicRoomDialog from '../dialogs/CreatePublicRoomDialog';
import { useStores } from '../../stores';
import Search from '../common/Search';

const RoomButton = ({ roomInfo, onClick, disabled }) => {
  const handleClick = () => {
    onClick(roomInfo);
  };
  const themeContext = useContext(ThemeContext);

  return (
    <RoomJoinBtn onClick={handleClick} disabled={disabled}>
      <OpenChatIcon width={1} height={1} color={themeContext.IconNormal} />
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
  const themeContext = useContext(ThemeContext);

  const { t } = useTranslation();
  const { uiStore } = useStores();

  const store = useLocalStore(() => ({
    createModalVisible: false,
    keyword: '',
    currentOpenRoom: null,
    onRequest: false,
  }));

  const { roomStore, userStore } = useCoreStores();
  const history = useHistory();
  const { isGuest } = userStore.myProfile;

  useEffect(() => {
    if (visible) {
      const fetchOpenRoomList = async () => {
        const res = await roomStore.fetchOpenRoomList(userStore.myProfile.id);
        return res;
      };

      fetchOpenRoomList();
    } else {
      transaction(() => {
        store.createModalVisible = false;
        store.keyword = '';
        store.currentOpenRoom = null;
      });
    }
  }, [visible]);

  const closeHomeModal = () => {
    onCancel();
  };

  const closeCreateModal = () => {
    store.createModalVisible = false;
  };

  const openFailRoomEnter = () => {
    uiStore.openMessage({
      title: t('CM_OPEN_ROOM_HOME_16'),
      subTitle: t('CM_OPEN_ROOM_HOME_17'),
      isOpenRoom: true,
      roomInfo: store.currentOpenRoom,
      buttons: [
        {
          type: 'solid',
          text: t('CM_LOGIN_POLICY_03'),
          onClick: () => {
            uiStore.closeMessage();
          },
        },
      ],
    });
  };

  const handleConfirmEnter = async () => {
    const myUserId = userStore.myProfile.id;
    if (store.onRequest) return;

    try {
      store.onRequest = true;
      const res = await roomStore.enterRoom({
        myUserId,
        roomId: store.currentOpenRoom.id,
      });

      if (!res.result) {
        openFailRoomEnter();
      } else if (res?.roomId) {
        history.push(`/s/${store.currentOpenRoom.id}/talk`);
        uiStore.closeMessage();
        closeHomeModal();
      }
      logEvent('room', 'clickEnterOpenRoomBtn');
    } catch (err) {
      console.error('ROOM ENTER ERROR : ', err);
      openFailRoomEnter();
    } finally {
      store.onRequest = false;
    }
  };

  const openEnterModal = () => {
    uiStore.openMessage({
      title: store.currentOpenRoom.name,
      subTitle: t('CM_OPEN_ROOM_HOME_06'),
      isOpenRoom: true,
      roomInfo: store.currentOpenRoom,
      type: 'custom',
      customBadge: (
        <CustomBadge>
          <Photos
            srcList={roomStore.getRoomPhoto(store.currentOpenRoom.id)}
            defaultDiameter="2.26"
          />
        </CustomBadge>
      ),
      buttons: [
        {
          type: 'solid',
          text: t('CM_OPEN_ROOM_HOME_07'),
          onClick: handleConfirmEnter,
        },
        {
          type: 'outlined',
          text: t('CM_CANCEL'),
          onClick: () => {
            uiStore.closeMessage();
          },
        },
      ],
    });
  };

  const handleRequestOK = async () => {
    try {
      await roomStore.requestEnterRoom({
        roomId: store.currentOpenRoom.id,
      });
    } catch (err) {
      console.log('입장 요청 에러');
    }

    uiStore.closeMessage();
    closeHomeModal();
  };

  const openRequestModal = () => {
    uiStore.openMessage({
      title: store.currentOpenRoom.name,
      subTitle: t('TEST_REQUEST'),
      isOpenRoom: true,
      roomInfo: store.currentOpenRoom,
      type: 'custom',
      customBadge: (
        <CustomBadge>
          <Photos
            srcList={roomStore.getRoomPhoto(store.currentOpenRoom.id)}
            defaultDiameter="2.26"
          />
        </CustomBadge>
      ),
      buttons: [
        {
          type: 'solid',
          text: t('TEST_REQUEST_OK'),
          onClick: handleRequestOK,
        },
        {
          type: 'outlined',
          text: t('CM_CANCEL'),
          onClick: () => {
            uiStore.closeMessage();
          },
        },
      ],
    });
  };

  const handleCreateRoom = () => {
    store.createModalVisible = true;
  };

  const handleKeywordChange = value => {
    store.keyword = value;
  };

  const handleKeywordClear = () => {
    store.keyword = '';
  };

  const handleJoin = async roomInfo => {
    store.currentOpenRoom = roomInfo;

    if (roomInfo.isRequested) {
      uiStore.openToast({
        text: t('CM_OPEN_ROOM_HOME_12'),
        onClose: () => {
          uiStore.closeToast();
        },
      });
      return;
    }

    if (roomInfo.isBanned) {
      openFailRoomEnter();
    } else if (roomInfo.isJoined) {
      history.push(`/s/${roomInfo.id}/talk`);
      closeHomeModal();
    } else if (roomInfo.isJoinable) {
      // 바로 입장 가능
      openEnterModal();
    } else {
      // 요청 후 입장 가능
      openRequestModal();
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

  // Public Room
  const handleCreatePublicRoomOk = async ({
    roomName,
    selectedUsers,
    isStartMeeting,
    isJoinable,
  }) => {
    const data = {
      name: roomName,
      creatorId: userStore.myProfile.id,
      userList: selectedUsers.map(user => ({
        userId: user.friendId || user.id,
      })),
      type: 'open',
      isJoinable,
      language: userStore.myProfile.language,
    };

    closeHomeModal();
    closeCreateModal();

    console.log('Data : ', data);
    const { roomId } = await roomStore.createRoom(data);

    if (isStartMeeting) {
      uiStore.openWindow({
        id: roomId,
        type: 'meeting',
        name: null,
        userCount: null,
        handler: null,
      });
    }

    history.push(`/s/${roomId}/talk`);
  };

  const handleCreatePublicRoomCancel = () => {
    closeCreateModal();
  };

  const getOpenRoomText = roomInfo => {
    if (roomInfo.isJoined) return t('CM_OPEN_ROOM_HOME_10');
    if (roomInfo.isRequested) return t('CM_OPEN_ROOM_HOME_11');
    return '';
  };

  const getRoomItems = searchKeyword => {
    const rooms = roomStore
      .getOpenRoomArray()
      .filter(
        roomInfo =>
          roomInfo.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
          roomInfo.adminName
            .toLowerCase()
            .includes(searchKeyword.toLowerCase()),
      );

    if (rooms.length) {
      return rooms.map(roomInfo => {
        return (
          <RoomListItem key={roomInfo.id}>
            <div style={{ flex: '0 0 2.26rem', marginRight: '0.63rem' }}>
              <Photos
                srcList={roomStore.getRoomPhoto(roomInfo.id)}
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
                  <AdminText>{`${t('CM_ROOM_ADMIN')} ${roomInfo.adminName
                    }`}</AdminText>
                </div>
              )}
            </Observer>
            <Observer>
              {() => <JoinedText>{getOpenRoomText(roomInfo)}</JoinedText>}
            </Observer>
            <RoomButton roomInfo={roomInfo} onClick={handleJoin} />
          </RoomListItem>
        );
      });
    }

    return (
      <RoomSearchForm>
        <SearchSubText>
          <Trans
            i18nKey="CM_OPEN_ROOM_HOME_05"
            components={{
              style: <SearchTitle />,
            }}
            values={{ result: store.keyword }}
          />
        </SearchSubText>
      </RoomSearchForm>
    );
  };

  return (
    <>
      <Observer>
        {() => (
          <CreatePublicRoomDialog
            visible={store.createModalVisible}
            onOk={handleCreatePublicRoomOk}
            onCancel={handleCreatePublicRoomCancel}
          />
        )}
      </Observer>

      <Modal
        title={t('CM_OPEN_ROOM_HOME_01')}
        visible={visible}
        mask={false}
        footer={null}
        onCancel={closeHomeModal}
        destroyOnClose
      >
        <OpenHomeForm>
          <Search
            placeholder={t('CM_OPEN_ROOM_HOME_02')}
            onChange={handleKeywordChange}
            onClear={handleKeywordClear}
            searchIconColor={{ active: '#48423B', default: '#48423B' }}
            type="border"
          />
          <Observer>
            {() =>
              !store.keyword ? (
                <>
                  {isGuest ? null : (
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
                                <Trans
                                  i18nKey="CM_OPEN_ROOM_HOME_03"
                                  components={{
                                    style: <RoomCount />,
                                  }}
                                  values={{ num: openRooms.length }}
                                />
                              </RoomTitle>
                              <StyledSlider
                                arrows
                                initialSlide={0}
                                slidesToShow={4}
                                slidesToScroll={4}
                                infinite={false}
                              >
                                <ItemAddBtn onClick={handleCreateRoom}>
                                  <span>{t('CM_CREATE_OPEN_ROOM')}</span>
                                  <AddIcon
                                    width="1.25"
                                    height="1.25"
                                    color={themeContext.IconNormal}
                                  />
                                </ItemAddBtn>
                                {openRooms.map(openRoom => {
                                  return (
                                    <OpenRoomItem
                                      key={openRoom.id}
                                      roomInfo={openRoom}
                                      photo={roomStore.getRoomPhoto(
                                        openRoom.id,
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
                  )}
                  <RecommendRoomListBox>
                    <RoomOpenTitle>{t('CM_OPEN_ROOM_HOME_04')}</RoomOpenTitle>
                    <Observer>
                      {() => (
                        <RoomList>
                          {roomStore
                            .getOpenRoomArray()
                            .filter(roomInfo => !roomInfo.isJoined)
                            .map(roomInfo => (
                              <RoomListItem key={roomInfo.id}>
                                <OpenRoomPhotos
                                  srcList={roomStore.getRoomPhoto(roomInfo.id)}
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
                                  {getOpenRoomText(roomInfo)}
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
                  <RoomList>{getRoomItems(store.keyword)}</RoomList>
                </RecommendRoomListBox>
              )
            }
          </Observer>
        </OpenHomeForm>
      </Modal>
    </>
  );
}

const OpenHomeForm = styled.div`
  display: flex;
  flex-direction: column;
  width: 24.38rem;
  height: 29.75rem;
  padding: 0.63rem 0.94rem;
`;

const JoinedText = styled.div`
  padding: 0 0.25rem 0 0.5rem;
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
  border-bottom: 1px solid ${props => props.theme.LineSub};
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
  color: ${props => props.theme.TextMain};
`;

const RoomOpenTitle = styled(RoomTitle)`
  padding-bottom: 0.63rem;
`;

const RoomCount = styled.span`
  margin-left: 0.5rem;
  font-size: 0.75rem;
  color: ${props => props.theme.TextSub2};
`;

const ItemAddBtn = styled.button`
  position: relative;
  width: 3.75rem !important;
  height: 3.75rem;
  margin: 0 auto;
  border-radius: 50%;
  background-color: ${props => props.theme.SubStateNormal};
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
  color: ${props => props.theme.TextMain};
  overflow-x: hidden;
  text-overflow: ellipsis;
`;

const AdminText = styled.p`
  overflow-x: hidden;
  text-overflow: ellipsis;
  font-size: 0.63rem;
  color: #696969;
`;

const SearchTitle = styled.p`
  font-weight: 500;
  font-size: 0.94rem;
  color: ${props => props.theme.TextMain};
  letter-spacing: 0;
  text-align: center;
  margin-bottom: 0.63rem;
`;

const SearchSubText = styled.p`
  font-weight: 400;
  font-size: 0.75rem;
  color: ${props => props.theme.TextMain};
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
    background-color: ${props => props.theme.StateDark};
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
  background: ${props => props.theme.SubStateNormal};
  border-radius: 50%;
  z-index: 1;

  &:hover {
    background: ${props => props.theme.SubStateBright};
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

const CustomBadge = styled.div`
  display: flex;
  justify-content: center;
`;

export default OpenRoomHome;
