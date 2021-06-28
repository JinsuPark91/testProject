import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Talk } from 'teespace-talk-app';
import { App as MeetingApp } from 'teespace-meeting-app';
import { EventBus, useCoreStores, ProfileInfoModal } from 'teespace-core';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { Observer } from 'mobx-react';
import LoadingImg from '../assets/WAPL_Loading.gif';
import RoomInquiryModal from '../components/Rooms/RoomInquiryModal';
import Photos from '../components/Photos';
import { SearchIcon } from '../components/Icons';
import WindowManager from '../components/common/WindowManager';
import { useStores } from '../stores';
import { isDarkMode } from '../utils/GeneralUtil';

const NewWindowPage = () => {
  const { resourceId: roomId, mainApp } = useParams();
  const {
    roomStore,
    userStore,
    spaceStore,
    friendStore,
    themeStore,
  } = useCoreStores();
  const { i18n } = useTranslation();
  const myUserId = userStore.myProfile.id;

  const [channelId, setChannelId] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);

  const init = async () => {
    try {
      // EventBus.dispatch('Platform:initLNB');

      // 스페이스를 불러오자
      await spaceStore.fetchSpaces({
        userId: myUserId,
        isLocal: process.env.REACT_APP_ENV === 'local',
      });

      // 룸을 불러오자
      const roomInfo = await roomStore.fetchRoom({ roomId });
      const channelInfo = roomInfo.channelList.find(
        channel =>
          channel.type === (mainApp === 'talk' ? 'CHN0001' : 'CHN0005'),
      );

      // 프렌드 리스트를 불러오자
      await friendStore.fetchFriends();
      setChannelId(channelInfo.id);

      await userStore.getMyDomainSetting();
      if (!userStore.myProfile.language) {
        await userStore.updateMyDomainSetting({
          language: i18n.language,
        });
      } else i18n.changeLanguage(userStore.myProfile.language);

      const platformTheme = userStore.myProfile.theme;
      if (platformTheme && platformTheme !== 'system')
        themeStore.setTheme(platformTheme);
      else if (isDarkMode()) themeStore.setTheme('dark');
    } catch (err) {
      console.error('Mini Talk Error : ', err);
    }
  };

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    if (roomId && channelId) {
      setIsLoaded(true);
    }
  }, [roomId, channelId]);

  if (!isLoaded) {
    return (
      <Loader>
        <img src={LoadingImg} alt="loader" />
      </Loader>
    );
  }

  const openSearch = () => EventBus.dispatch('Talk:OpenSearch');

  switch (mainApp) {
    case 'talk':
      return (
        <Wrapper>
          <WindowManager />
          <Header roomId={roomId} onSearch={openSearch} />
          <Content>
            <Talk
              language={i18n.language}
              roomId={roomId}
              channelId={channelId}
              layoutState="expand"
              isMini
            />
          </Content>
        </Wrapper>
      );
    case 'meeting':
      return (
        <>
          <WindowManager />
          <MeetingApp
            language={i18n.language}
            roomId={roomId}
            channelId={channelId}
            layoutState="expand"
          />
        </>
      );
    default:
      return null;
  }
};

export default NewWindowPage;

const Header = ({ roomId, onSearch }) => {
  const { uiStore } = useStores();
  const { roomStore, userStore } = useCoreStores();
  const [modalVisible, setModalVisible] = useState(false);

  const getRoom = () => {
    return roomStore.getRoom(roomId);
  };

  const getRoomName = roomInfo => {
    const { type, customName, name } = roomInfo;
    switch (type) {
      case 'WKS0001':
        return userStore.myProfile.displayName;
      default:
        return customName || name;
    }
  };

  const handlePhotoClick = () => {
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
  };

  const getModal = () => {
    const info = getRoom();
    if (!info) return null;
    if (info.isMyRoom || info.userCount === 2) {
      const userIds = info.isMyRoom
        ? userStore.myProfile.id
        : info.memberIdListString
            .split(',')
            .find(userId => userId !== userStore.myProfile.id);
      return (
        <ProfileInfoModal
          userId={userIds}
          visible={modalVisible}
          onClickMeeting={_roomId => {
            uiStore.openWindow({
              id: _roomId,
              type: 'meeting',
              name: null,
              userCount: null,
              handler: null,
            });
          }}
          onClose={handleModalClose}
          position={{ top: '3.5rem', left: '0' }}
        />
      );
    }
    return (
      <RoomInquiryModal
        roomId={roomId}
        visible={modalVisible}
        onCancel={handleModalClose}
        width="17.5rem"
        top="3.5rem"
        left="0"
      />
    );
  };

  return (
    <HeaderWrapper>
      {getModal()}

      <Observer>
        {() => {
          const info = getRoom();
          if (!info) return null;

          return (
            <Photos
              isClickable={!info.isBotRoom}
              srcList={roomStore.getRoomPhoto(info.id)}
              onClick={handlePhotoClick}
              className="header__room-photo"
            />
          );
        }}
      </Observer>

      <Observer>
        {() => {
          const info = getRoom();
          if (!info) return null;

          return <span className="header__room-name">{getRoomName(info)}</span>;
        }}
      </Observer>

      <Observer>
        {() => {
          const info = getRoom();
          if (!info || info.isDirectMsg || info.isMyRoom) return null;
          return <span className="header__user-count">{info.userCount}</span>;
        }}
      </Observer>

      <IconWrapper onClick={onSearch}>
        <SearchIcon width={1.38} height={1.38} />
      </IconWrapper>
    </HeaderWrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 400px;
  min-height: 600px;
  height: 100%;
`;

const HeaderWrapper = styled.div`
  overflow: hidden;
  display: flex;
  align-items: center;
  height: 3.75rem;
  padding: 0 1.25rem 0 0.69rem;
  border-bottom: 1px solid ${props => props.theme.LineMain};
  background-color: ${props => props.theme.StateNormal};
  .header__room-name {
    flex-shrink: 0;
  }

  .header__room-name {
    overflow: hidden;
    margin-left: 0.63rem;
    font-size: 0.875rem;
    color: ${props => props.theme.TextMain};
  }

  .header__user-count {
    margin-left: 0.31rem;
    font-size: 0.875rem;
    color: ${props => props.theme.TextSub2};
  }
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 0.25rem;
  cursor: pointer;
  margin-left: auto;

  &:hover {
    background-color: ${props => props.theme.StateLight};
  }
`;

const Content = styled.div`
  height: calc(100% - 3.75rem);

  & > div,
  & > div > div:nth-child(2) {
    @media (max-width: 1024px) {
      position: relative;
    }
  }
`;

const Loader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;

  & img {
    width: 4.06rem;
    height: 4.06rem;
  }
`;
