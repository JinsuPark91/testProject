import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Talk, talkRoomStore } from 'teespace-talk-app';
import { App as MeetingApp } from 'teespace-meeting-app';
import { useCoreStores, AppState } from 'teespace-core';
import styled from 'styled-components';
import LoadingImg from '../assets/WAPL_Loading.gif';

const NewWindowPage = () => {
  const { resourceId: roomId, mainApp } = useParams();
  const { roomStore, userStore, spaceStore } = useCoreStores();
  const myUserId = userStore.myProfile.id;

  const [channelId, setChannelId] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [meetingState, setMeetingState] = useState('');

  const init = async () => {
    try {
      if (mainApp === 'talk') {
        await talkRoomStore.initialize(myUserId);
      }

      // 스페이스를 불러오자
      const result = await spaceStore.fetchSpaces({
        userId: myUserId,
        isLocal: process.env.REACT_APP_ENV === 'local',
      });
      console.log('SPACE STORE : ', result);

      // 룸을 불러오자
      const roomInfo = await roomStore.fetchRoom({ roomId, myUserId });
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

  switch (mainApp) {
    case 'talk':
      return (
        <Talk
          roomId={roomId}
          channelId={channelId}
          layoutState="expand"
          isSearchInputVisible={false}
          onSearchClose={() => {}}
          isMini
        />
      );
    case 'meeting':
      return (
        <MeetingApp
          roomId={roomId}
          channelId={channelId}
          layoutState="expand"
          appState={meetingState}
          onChangeAppState={state => {
            setMeetingState(state);
            // if (state === AppState.STOPPED) {
            //   history.push(PlatformUIStore.nextLocation);
            // }
          }}
        />
      );
    default:
      return null;
  }
};

export default NewWindowPage;

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
