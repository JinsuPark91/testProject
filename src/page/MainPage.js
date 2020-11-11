import React, { useState, useEffect, useMemo } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { EventBus, useCoreStores } from 'teespace-core';
import { talkRoomStore } from 'teespace-talk-app';
import LeftSide from '../components/main/LeftSide';
import MainSide from '../components/main/MainSide';
import { Wrapper } from './MainPageStyle';
import PlatformUIStore from '../stores/PlatformUIStore';

const useQueryParams = (searchParams = window.location.search) => {
  return Object.fromEntries(new URLSearchParams(searchParams));
};

const MainPage = () => {
  const [isLoading, setIsLoading] = useState(true);

  const history = useHistory();
  const { resourceType, resourceId, mainApp } = useParams();
  const { sub: subApp } = useQueryParams(history.location.search);

  const { roomStore, userStore } = useCoreStores();
  const myUserId = userStore.myProfile.id;

  /*
    Loading 체크
  */
  useEffect(() => {
    Promise.all([
      // 룸을 불러오자
      roomStore.fetchRoomList({ myUserId }),
      // 유저 프로필을 불러오자
      userStore.fetchRoomUserProfileList({}),
    ])
      .then(() => {
        // Talk init 하자 (lastMessage, unread count ...)
        return talkRoomStore.initialize(myUserId);
      })
      .then(() => {
        setIsLoading(false);
        console.log('USER PROFILES : ', userStore.userProfiles);
      })
      .catch(err => {
        console.log(err);
      });
  }, []);

  // 묶어 놓으면, 하나 바뀔때도 다 바뀜
  useEffect(() => {
    PlatformUIStore.resourceType = resourceType;
    PlatformUIStore.tabType = resourceType;
  }, [resourceType]);

  useEffect(() => {
    PlatformUIStore.resourceId = resourceId;
  }, [resourceId]);

  useEffect(() => {
    PlatformUIStore.mainApp = mainApp;
  }, [mainApp]);

  useEffect(() => {
    PlatformUIStore.subApp = subApp;
    if (!subApp) {
      PlatformUIStore.layout = 'close';
    } else {
      PlatformUIStore.layout = 'collapse';
    }
  }, [subApp]);

  /*
    Layout Event 초기화
  */
  useEffect(() => {
    const fullHandler = EventBus.on('onLayoutFull', () => {
      PlatformUIStore.layout = 'full';
    });
    const expandHandler = EventBus.on('onLayoutExpand', () => {
      PlatformUIStore.layout = 'expand';
    });
    const collapseHandler = EventBus.on('onLayoutCollapse', () => {
      PlatformUIStore.layout = 'collapse';
    });
    const closeHandler = EventBus.on('onLayoutClose', () => {
      history.push({
        pathname: history.location.pathname,
        search: null,
      });
    });

    return () => {
      EventBus.off('onLayoutFull', fullHandler);
      EventBus.off('onLayoutExpand', expandHandler);
      EventBus.off('onLayoutCollapse', collapseHandler);
      EventBus.off('onLayoutClose', closeHandler);
    };
  }, []);

  const leftSide = useMemo(() => <LeftSide />, []);
  const mainSide = useMemo(() => <MainSide />, []);

  return isLoading ? (
    <div>Loading...</div>
  ) : (
    <Wrapper>
      {leftSide}
      {mainSide}
    </Wrapper>
  );
};

export default MainPage;
