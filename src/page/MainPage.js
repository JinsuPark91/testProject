/* eslint-disable no-underscore-dangle */
import React, { useState, useEffect, useMemo } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { EventBus, useCoreStores, DesktopNotification } from 'teespace-core';
import { talkRoomStore } from 'teespace-talk-app';
import { beforeRoute as noteBeforeRoute } from 'teespace-note-app';
import { Prompt } from 'react-router';
import LeftSide from '../components/main/LeftSide';
import MainSide from '../components/main/MainSide';
import { Loader, Wrapper } from './MainPageStyle';
import PlatformUIStore from '../stores/PlatformUIStore';
import LoadingImg from '../assets/TeeSpace_loading.gif';
import FloatingButton from '../components/common/FloatingButton';

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
        isLocal: process.env.REACT_APP_ENV === 'local',
      }),
      // 룸을 불러오자
      roomStore.fetchRoomList({ myUserId }),
      // 유저 프로필을 불러오자
      userStore.fetchRoomUserProfileList({}),
      // 프렌드 리스트를 불러오자
      friendStore.fetchFriends({ myUserId }),
      // 접속 정보를 불러오자.
      userStore.getRoutingHistory({ userId: myUserId }),
    ])
      .then(async res => {
        // roomStore fetch 후에 Talk init 하자 (lastMessage, unreadCount, ...)
        await talkRoomStore.initialize(myUserId);

        const [, , , , histories] = res;
        const lastUrl = histories?.[0]?.lastUrl;
        return Promise.resolve(lastUrl);
      })
      .then(lastUrl => {
        // NOTE : 마지막 접속 URL 로 Redirect 시킨다.
        if (lastUrl) {
          history.push(lastUrl);
        }

        setIsLoading(false);
      })
      .catch(err => {
        setTimeout(() => {
          history.push('/logout');
        }, 1000);
        console.log(err);
      });
  }, []);

  // 묶어 놓으면, 하나 바뀔때도 다 바뀜
  useEffect(() => {
    PlatformUIStore.resourceType = resourceType;
    PlatformUIStore.tabType = resourceType;
  }, [resourceType]);

  useEffect(() => {
    if (resourceType === 'm' && !isLoading) {
      PlatformUIStore.resourceId = roomStore.getDMRoom(
        myUserId,
        myUserId,
      ).roomInfo.id;
    } else {
      PlatformUIStore.resourceId = resourceId;
    }
  }, [isLoading, resourceId, resourceType]);

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

  const saveHistory = async (location, action) => {
    // NOTE : 이 시점에서, resourceId, resouceType, mainApp, subApp 값은 아직 변경되지 않은 상태.
    const { pathname, search } = location;
    const pathArr = pathname.split('/');

    const currentResourceType = pathArr[1];
    const currentMainApp = pathArr[3];
    const currentSubApp = /sub=(.[^/&?#]*)/gi.exec(search)?.[1];

    let currentResourceId = pathArr[2];
    switch (currentResourceType) {
      case 'f':
        currentResourceId = 'profile';
        break;
      case 'm':
        currentResourceId = 'mail';
        break;
      // NOTE : 기본값이 roomId 이기 때문에, s에 대한 처리는 하지 않았음.
      default:
        break;
    }

    try {
      await userStore.updateRoutingHistory({
        userId: myUserId,
        roomId: currentResourceId,
        lastUrl: `${pathname}${search}`,
        appInfo: `${currentMainApp || ''}/${currentSubApp || ''}`,
      });
    } catch (err) {
      console.error('[Platform] History update 에러 : ', err);
    }
  };

  const isRunning = appName => {
    return mainApp === appName || subApp === appName;
  };

  const beforeRoute = (location, action) => {
    let isRoutable = true;

    // 각 앱의 beforeRoute 를 받아서 처리하자.
    if (isRunning('note'))
      isRoutable = isRoutable && noteBeforeRoute(location, action);

    // if (isRunning('meeting'))
    //   isRoutable = isRoutable && meetingBeforeRoute(location, action);

    if (isRoutable) {
      saveHistory(location, action);
    }
    return isRoutable;
  };

  if (isLoading) {
    return (
      <Loader>
        <img src={LoadingImg} alt="loader" />
      </Loader>
    );
  }

  return (
    <Wrapper>
      <Prompt
        message={(location, action) => {
          return beforeRoute(location, action);
        }}
      />
      {leftSide}
      {mainSide}
      <FloatingButton
        visible
        roomList={roomStore.getRoomArray()}
        slidesToShow={7}
        onItemClick={roomInfo => {
          console.log('Item Clicked. ', roomInfo);
        }}
        onItemClose={roomInfo => {
          console.log('Item Closed. ', roomInfo);
        }}
        onCloseAll={() => {
          console.log('All Closed.');
        }}
      />
    </Wrapper>
  );
};

export default MainPage;
