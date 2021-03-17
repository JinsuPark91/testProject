import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Observer } from 'mobx-react';
import { useCoreStores } from 'teespace-core';
import { talkRoomStore } from 'teespace-talk-app';
import styled from 'styled-components';
import PlatformUIStore from '../../stores/PlatformUIStore';
import MobileContent from './MobileContent';
import MobileFooter from './MobileFooter';
import LoadingImg from '../../assets/WAPL_Loading.gif';

const Wrapper = styled.div`
  height: 100%;
`;
const Loader = styled.div``;

const MobileMainPage = () => {
  const { resourceType, resourceId } = useParams();
  const { userStore, friendStore, roomStore } = useCoreStores();
  const [isLoading, setIsLoading] = useState(true);
  const history = useHistory();
  const myUserId = userStore.myProfile.id;

  useEffect(() => {
    Promise.all([
      userStore.fetchRoomUserProfileList({}),
      friendStore.fetchFriends({ myUserId }),
      roomStore.fetchRoomList({ myUserId }),
    ]).then(async () => {
      await talkRoomStore.initialize(myUserId);
      history.push(`/friend/${myUserId}`); // FIXME: 임시
      setIsLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    PlatformUIStore.resourceType = resourceType;
    PlatformUIStore.resourceId = resourceId;
  }, [resourceType, resourceId]);

  if (isLoading) {
    return (
      <Loader>
        <img src={LoadingImg} alt="loading" />
      </Loader>
    );
  }

  return (
    <Observer>
      {() => (
        <Wrapper>
          <MobileContent />
          {PlatformUIStore.resourceType !== 'profile' && <MobileFooter />}
        </Wrapper>
      )}
    </Observer>
  );
};

export default MobileMainPage;
