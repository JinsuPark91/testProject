import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Talk, talkRoomStore } from 'teespace-talk-app';
import { useCoreStores } from 'teespace-core';
import styled from 'styled-components';
import LoadingImg from '../assets/WAPL_Loading.gif';
import Photos from '../components/Photos';
import { SearchIcon } from '../components/Icons';

const NewWindowPage = () => {
  const { resourceId: roomId, mainApp } = useParams();
  const { roomStore, userStore } = useCoreStores();
  const myUserId = userStore.myProfile.id;

  const [channelId, setChannelId] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSearch, setIsSearch] = useState(false);

  const init = async () => {
    try {
      await talkRoomStore.initialize(myUserId);

      // 룸을 불러오자
      const roomInfo = await roomStore.fetchRoom({ roomId, myUserId });
      console.log('Room Info : ', roomInfo);
      const channelInfo = roomInfo.channelList.find(
        channel =>
          channel.type === (mainApp === 'talk' ? 'CHN0001' : 'CHN0005'),
      );
      setChannelId(channelInfo.id);
    } catch (err) {
      console.error('Mini Talk Error : ', err);
    }
  };

  useEffect(() => {
    init();

    // NOTE : 로딩중 닫으면 호출하지 않는다. (redirect 때문에 어렵다.)
    window.addEventListener('beforeunload', () => {
      // NOTE : 부모가 새로고침, 닫기 구분 필요.
      window.opener.fromChild(roomId);
    });
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

  const openSearch = () => setIsSearch(true);
  const closeSearch = () => setIsSearch(false);

  return (
    <Wrapper>
      <Header roomId={roomId} onSearch={openSearch} />
      <Content>
        <Talk
          roomId={roomId}
          channelId={channelId}
          layoutState="expand"
          isSearchInputVisible={isSearch}
          onSearchClose={closeSearch}
          isMini
        />
      </Content>
    </Wrapper>
  );
};

export default NewWindowPage;

const Header = ({ roomId, onSearch }) => {
  const { roomStore, userStore } = useCoreStores();
  const [info, setInfo] = useState({
    name: '',
    srcs: [],
    userCount: 0,
    isDMRoom: false,
    isMyRoom: false,
  });

  const getRoomName = roomInfo => {
    const { type, customName, name } = roomInfo;
    switch (type) {
      case 'WKS0001':
        return userStore.myProfile.nick || userStore.myProfile.name;
      default:
        return customName || name;
    }
  };

  const getSrcs = roomInfo => {
    const { isDirectMsg: isDMRoom, memberIdListString } = roomInfo;
    let userIds = memberIdListString.split(',').splice(0, 4);
    if (isDMRoom)
      userIds = userIds.filter(userId => userId !== userStore.myProfile.id);

    return userIds.map(userId => userStore.getProfilePhotoURL(userId, 'small'));
  };

  useEffect(() => {
    if (roomId) {
      const targetRoomInfo = roomStore.getRoom(roomId);
      const { isDirectMsg: isDMRoom, type, userCount } = targetRoomInfo;
      const name = getRoomName(targetRoomInfo);
      const srcs = getSrcs(targetRoomInfo);
      setInfo({
        name,
        srcs,
        userCount,
        isDMRoom,
        isMyRoom: type === 'WKS0001',
      });
    }
  }, [roomId]);

  return (
    <HeaderWrapper>
      <Photos srcList={info.srcs} />
      <span className="header__room-name">{info.name}</span>

      {info.isDMRoom || info.isMyRoom ? null : (
        <span className="header__user-count">{info.userCount}</span>
      )}
      <IconWrapper onClick={onSearch}>
        <SearchIcon width={1.38} height={1.38} />
      </IconWrapper>
    </HeaderWrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const HeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  height: 3.75rem;
  padding: 0 1.25rem 0 0.69rem;
  border-bottom: 1px solid #ddd9d4;

  & .header__room-name {
    font-size: 0.875rem;
    margin-left: 0.63rem;
  }

  & .header__user-count {
    font-size: 0.875rem;
    margin-left: 0.31rem;
    opacity: 0.5;
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
    background-color: #eae6e0;
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
