import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Talk, talkRoomStore } from 'teespace-talk-app';
import { useCoreStores } from 'teespace-core';
import styled from 'styled-components';
import LoadingImg from '../assets/WAPL_Loading.gif';

const MiniTalkPage = () => {
  const { resourceId: roomId } = useParams();
  const { roomStore, userStore } = useCoreStores();
  const myUserId = userStore.myProfile.id;

  const [channelId, setChannelId] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);

  const init = async () => {
    try {
      await talkRoomStore.initialize(myUserId);
      const roomInfo = await roomStore.fetchRoom({ roomId, myUserId });

      const channelInfo = roomInfo.channelList.find(
        channel => channel.type === 'CHN0001',
      );
      setChannelId(channelInfo.id);
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

  return (
    <div>
      {isLoaded ? (
        <Talk
          roomId={roomId}
          channelId={channelId}
          layoutState="expand"
          isSearchInputVisible={false}
          onSearchClose={() => {}}
        />
      ) : (
        <Loader>
          <img src={LoadingImg} alt="loader" />
        </Loader>
      )}
    </div>
  );
};

export default MiniTalkPage;

const Loader = styled.div`
  width: 4.06rem;
  height: 4.06rem;

  & img {
    width: 100%;
    height: 100%;
  }
`;
