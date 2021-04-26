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
  Toast,
  Message,
} from 'teespace-core';
import { beforeRoute as noteBeforeRoute } from 'teespace-note-app';
import { WindowMail } from 'teespace-mail-app';
import { Prompt } from 'react-router';
import { useTranslation } from 'react-i18next';
import { ThemeProvider } from 'styled-components';
import { useObserver } from 'mobx-react';
import LeftSide from '../components/main/LeftSide';
import MainSide from '../components/main/MainSide';
import { Loader, Wrapper } from './MainPageStyle';
import PlatformUIStore from '../stores/PlatformUIStore';
import LoadingImg from '../assets/WAPL_Loading.gif';
import FaviconChanger from '../components/common/FaviconChanger';
import WindowManager from '../components/common/WindowManager';
import { getQueryParams, getQueryString } from '../utils/UrlUtil';

const MainPage = () => {
  const { t, i18n } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [isToastVisible, setIsToastVisible] = useState(false);
  const [toastText, setToastText] = useState('');
  const [isRefreshModalVisible, setIsRefreshModalVisible] = useState(false);

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
        EventBus.dispatch('Platform:initLNB');

        // 프렌즈 프로필은 모두 가져오자
        if (friendStore.friendInfoList.length) {
          const friendIdList = friendStore.friendInfoList.map(
            elem => elem.friendId,
          );
          await userStore.fetchProfileList(friendIdList);
        }

        const [, , , , histories, alarmList] = res;
        AlarmSetting.initAlarmSet(alarmList);

        const lastUrl = histories?.[0]?.lastUrl;
        return Promise.resolve(lastUrl);
      })
      .then(async lastUrl => {
        // 계정 langauge 적용. 없으면 브라우저 기본 langauge로 업데이트 한다.
        await userStore.getMyLanguage();
        if (!userStore.myProfile.language) {
          await userStore.updateMyLanguage({
            language: i18n.language,
          });
        } else {
          i18n.changeLanguage(userStore.myProfile.language);
        }

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
          // NOTE: 이벤트명은 core에서 불릴 것 같지만, 플랫폼에서 불러줌
          EventBus.dispatch('Platform:reconnectWebSocket');
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
    const resType = PlatformUIStore.resourceType;
    const resId = PlatformUIStore.resourceId;

    switch (message.NOTI_TYPE) {
      // 강퇴 또는 나가기
      case 'exitRoom':
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
    const openMeetingHandler = EventBus.on('onMeetingOpen', ({ roomId }) => {
      PlatformUIStore.openWindow({
        id: roomId,
        type: 'meeting',
        name: null,
        userCount: null,
        handler: null,
      });
    });
    const errorHandler = EventBus.on(
      'CoreRequest:forbidden',
      ({ response }) => {
        const { status } = response;
        switch (status) {
          case 403:
            setToastText(t('TEMP_GUEST_ACCESS_DENIED'));
            setIsToastVisible(true);
            break;
          default:
            break;
        }
      },
    );

    WWMS.addHandler('SYSTEM', 'platform_wwms', handleSystemMessage);

    return () => {
      EventBus.off('onLayoutFull', fullHandler);
      EventBus.off('onLayoutExpand', expandHandler);
      EventBus.off('onLayoutCollapse', collapseHandler);
      EventBus.off('onLayoutClose', closeHandler);
      EventBus.off('onMeetingOpen', openMeetingHandler);
      EventBus.off('CoreRequest:forbidden', errorHandler);
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

  // if (isLoading) {
  //   return (
  //     <Loader>
  //       <img src={LoadingImg} alt="loader" />
  //     </Loader>
  //   );
  // }

  return useObserver(() =>
    isLoading ? (
      <Loader>
        <img src={LoadingImg} alt="loader" />
      </Loader>
    ) : (
      <ThemeProvider theme={PlatformUIStore.theme}>
        <Wrapper>
          <Toast
            visible={isToastVisible}
            timeoutMs={1000}
            onClose={() => setIsToastVisible(false)}
          >
            {toastText}
          </Toast>
          <FaviconChanger />
          <Prompt
            message={(location, action) => {
              return beforeRoute(location, action);
            }}
          />
          {leftSide}
          {mainSide}
          <WindowManager />
          {/* <PortalWindowManager /> */}
          <WindowMail />
          {isRefreshModalVisible && (
            <Message
              visible={isRefreshModalVisible}
              title={t('CM_LOGIN_POLICY_10')}
              subtitle={t('CM_LOGIN_POLICY_11')}
              btns={[
                {
                  type: 'solid',
                  shape: 'round',
                  text: t('CM_LOGIN_POLICY_03'),
                  onClick: () => {
                    setIsRefreshModalVisible(false);
                    window.location.reload();
                  },
                },
              ]}
            />
          )}
        </Wrapper>
      </ThemeProvider>
    ),
  );
};

export default MainPage;
