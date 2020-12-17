import React, { useState, useEffect, useMemo } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { EventBus, useCoreStores, DesktopNotification } from 'teespace-core';
import { talkRoomStore } from 'teespace-talk-app';
import LeftSide from '../components/main/LeftSide';
import MainSide from '../components/main/MainSide';
import { Loader, Wrapper } from './MainPageStyle';
import PlatformUIStore from '../stores/PlatformUIStore';
import LoadingImg from '../assets/TeeSpace_loading.gif';

const useQueryParams = (searchParams = window.location.search) => {
  let result = {};
  const params = new URLSearchParams(searchParams);
  params.forEach((value, key) => {
    result = { ...result, [key]: value };
  });
  return result;
};

const MainPage = () => {
  const [isLoading, setIsLoading] = useState(true);

  const history = useHistory();
  const { resourceType, resourceId, mainApp } = useParams();
  const { sub: subApp } = useQueryParams(history.location.search);

  const { roomStore, userStore, friendStore, spaceStore } = useCoreStores();
  const myUserId = userStore.myProfile.id;

  /**
   * Desktop Notification 권한 확인 및 클릭 시 핸들링 추가
   */
  useEffect(() => {
    DesktopNotification.askPermission();
    DesktopNotification.onClick = noti => {
      const { data } = noti.target;
      if (data) {
        if (data.url) {
          history.push(data.url);
        }
      }
    };
  }, []);

  /*
    Loading 체크
  */
  useEffect(() => {
    Promise.all([
      // 스페이스를 불러오자
      spaceStore.fetchSpaces({
        userId: myUserId,
        isLocal: process.env.REACT_APP_ENV,
      }),
      // 룸을 불러오자
      roomStore.fetchRoomList({ myUserId }),
      // 유저 프로필을 불러오자
      userStore.fetchRoomUserProfileList({}),
      // 프렌드 리스트를 불러오자
      friendStore.fetchFriends({ myUserId }),
    ])
      .then(res => {
        // roomStore fetch 후에 Talk init 하자 (lastMessage, unreadCount, ...)
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

  if (isLoading) {
    return (
      <Loader>
        <img src={LoadingImg} alt="loader" />
      </Loader>
    );
  }

  return (
    <Wrapper>
      {leftSide}
      {mainSide}
    </Wrapper>
  );
};

export default MainPage;
