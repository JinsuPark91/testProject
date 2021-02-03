/* eslint-disable no-underscore-dangle */
import React, { useState, useEffect, useMemo } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import {
  EventBus,
  useCoreStores,
  DesktopNotification,
  AppState,
  WWMS,
  AlarmSetting,
} from 'teespace-core';
import { Observer } from 'mobx-react';
import { talkRoomStore } from 'teespace-talk-app';
import { beforeRoute as noteBeforeRoute } from 'teespace-note-app';
import { initApp as initMailApp, WindowMail } from 'teespace-mail-app';
import { Prompt } from 'react-router';
import NewWindow from 'react-new-window';
import LeftSide from '../components/main/LeftSide';
import MainSide from '../components/main/MainSide';
import { Loader, Wrapper } from './MainPageStyle';
import PlatformUIStore from '../stores/PlatformUIStore';
import LoadingImg from '../assets/WAPL_Loading.gif';
import FaviconChanger from '../components/common/FaviconChanger';
import FloatingButton from '../components/common/FloatingButton';
import { getQueryParams, getQueryString } from '../utils/UrlUtil';

const MainPage = () => {
  const [isLoading, setIsLoading] = useState(true);

  const history = useHistory();
  const { resourceType, resourceId, mainApp } = useParams();
  const { sub: subApp } = getQueryParams(history.location.search);

  const { roomStore, userStore, friendStore, spaceStore } = useCoreStores();
  const myUserId = userStore.myProfile.id;

  const url = window.location.origin; //  http://xxx.dev.teespace.net
  const conURL = url.split(`//`)[1]; // xxx.dev.teespace.net
  const mainURL = conURL.slice(conURL.indexOf('.') + 1, conURL.length); // dev.teespace.net
  let domainName;
  [domainName] = url.split(`//`)[1].split(`.`);
  /**
   * Desktop Notification 권한 확인 및 클릭 시 핸들링 추가
   */
  useEffect(() => {
    // NOTE. IOS 브라우져의 경우는 브라우져 알림을 지원하지 않음.
    if (window.Notification) {
      DesktopNotification.askPermission();
      DesktopNotification.onClick = noti => {
        const { data } = noti.target;
        if (data) {
          if (data.url) {
            history.push(data.url);
          }
        }
      };
    }
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
      // 알림 세팅을 불러오자
      userStore.getAlarmList(myUserId),
    ])
      .then(async res => {
        // roomStore fetch 후에 Talk init 하자 (lastMessage, unreadCount, ...)
        await talkRoomStore.initialize(myUserId);
        initMailApp(myUserId);

        const [, , , , histories, alarmList] = res;
        AlarmSetting.initAlarmSet(alarmList);
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
        if (process.env.REACT_APP_ENV === 'local') {
          setTimeout(() => {
            history.push('/logout');
          }, 1000);
        } else {
          window.location.href = `${window.location.protocol}//${mainURL}/domain/${domainName}`;
        }
        console.log(err);
      });

    // NOTE : RECONNECT 임시 처리
    WWMS.setOnReconnect(() => {
      Promise.all([
        // 룸을 불러오자
        roomStore.fetchRoomList({ myUserId }),
      ])
        .then(() => {
          // talk init (fetch room 이후.)
          return talkRoomStore.updateRoomMetadataList(myUserId);
        })
        .catch(err => {
          if (process.env.REACT_APP_ENV === 'local') {
            setTimeout(() => {
              history.push('/logout');
            }, 1000);
          } else {
            window.location.href = `${window.location.protocol}//${mainURL}/domain/${domainName}`;
          }
          console.log(err);
        });
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
  }, [isLoading, resourceId, resourceType, myUserId, roomStore]);

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
  }, [subApp, resourceId]);

  const handleSystemMessage = message => {
    // console.log('WWMS Message : ', message);
    const resType = PlatformUIStore.resourceType;
    const resId = PlatformUIStore.resourceId;

    switch (message.NOTI_TYPE) {
      case 'deleteRoom': {
        const myRoomId = roomStore.getDMRoom(myUserId, myUserId)?.roomInfo?.id;

        if (resType === 's' && resId === message.SPACE_ID) {
          history.push(`/s/${myRoomId}/talk`);
        }
        break;
      }
      default:
        break;
    }
  };

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
      const queryParams = getQueryParams();
      delete queryParams.sub;
      const queryString = getQueryString(queryParams);

      history.push(`${history.location.pathname}?${queryString}`);
    });

    WWMS.addHandler('SYSTEM', 'platform_wwms', handleSystemMessage);

    return () => {
      EventBus.off('onLayoutFull', fullHandler);
      EventBus.off('onLayoutExpand', expandHandler);
      EventBus.off('onLayoutCollapse', collapseHandler);
      EventBus.off('onLayoutClose', closeHandler);
      WWMS.removeHandler('SYSTEM', 'platform_wwms');
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
    const { sub: currentSubApp } = getQueryParams(search);

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

    if (!currentResourceId) {
      return;
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

    if (isRunning('meeting')) {
      if (PlatformUIStore.subAppState === AppState.RUNNING) {
        // NOTE. 미팅앱에서 빠져 나갈 것인지 묻는 상태로 진입
        PlatformUIStore.subAppState = AppState.BEFORE_STOP;
        PlatformUIStore.nextLocation = location;
        isRoutable = false;
      } else if (PlatformUIStore.subAppState === AppState.STOPPED) {
        // NOTE. 미팅의 경우 라우팅이 변경될 때 토크 상태의 히스토리가 저장되어야 함.
        //  그렇지 않으면 이 방에 들어올 때마다 미팅이 실행됨.
        saveHistory({ ...history.location, search: '' }, action);
      } else {
        // DO NOTHING
      }
    }

    if (isRoutable) {
      saveHistory(location, action);

      // NOTE. 서브앱으로 라우팅되는 경우 초기화 진행중 상태로 진입됨.
      if (!subApp) {
        PlatformUIStore.subAppState = AppState.INITIALIZING;
      }
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
      <FaviconChanger />
      <Prompt
        message={(location, action) => {
          return beforeRoute(location, action);
        }}
      />
      {leftSide}
      {mainSide}
      <WindowManager />
      <WindowMail />
    </Wrapper>
  );
};

export default MainPage;

// [TODO] : 나중에 다른데로 옮기자.
const Window = ({ windowInfo }) => {
  const { id: windowId } = windowInfo;
  const url = `/s/${windowId}/${windowInfo.type}?mini=true`;
  const [handler, setHandler] = useState(null);
  const features =
    windowInfo.type === 'talk'
      ? {
          width: 600,
          height: 800,
        }
      : {};

  useEffect(() => {
    if (handler) {
      const info = PlatformUIStore.getWindow(windowId);
      info.handler = handler;
    }
  }, [handler]);

  const handleOpen = _handler => {
    setHandler(_handler);
  };

  return (
    <NewWindow
      url={url}
      name="_blank"
      onOpen={handleOpen}
      features={features}
      copyStyles
    />
  );
};

const WindowManager = () => {
  useEffect(() => {
    // NOTE : 부모가 새로고침, 닫기 구분 필요.
    window.fromChild = windowId => {
      // NOTE : 일단 새로고침 = 닫기로 둔다.
      // childWindow.closed 보면 되지만, 닫히는 시점과 맞지 않아 delay 시켜야 함.
      // console.log("Before ChildWindow : ", childWindow, childWindow.closed)
      // setTimeout(() => {
      //   console.log('After ChildWindow : ', childWindow, childWindow.closed);
      // }, 1000)
      PlatformUIStore.closeWindow(windowId);
    };
  }, []);

  return (
    <Observer>
      {() => {
        const { windows } = PlatformUIStore;
        const activeTalkWindows = windows.filter(
          windowInfo => windowInfo.handler && windowInfo.type === 'talk',
        );

        return (
          <>
            {windows.map(window => (
              <Window
                key={window.id}
                windowInfo={window}
                handler={window.handler}
              />
            ))}
            <FloatingButton
              visible={false}
              rooms={activeTalkWindows}
              count={5}
              onItemClick={roomInfo => {
                PlatformUIStore.focusWindow(roomInfo.id);
              }}
              onItemClose={roomInfo => {
                PlatformUIStore.closeWindow(roomInfo.id);
              }}
              onCloseAll={() => {
                PlatformUIStore.closeAllWindow();
              }}
            />
          </>
        );
      }}
    </Observer>
  );
};
