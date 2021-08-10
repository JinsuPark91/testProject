/* eslint-disable no-underscore-dangle */
import React, { useEffect, useMemo } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import {
  EventBus,
  useCoreStores,
  DesktopNotification,
  AppState,
  WWMS,
  Toast,
  Message,
} from 'teespace-core';
import { beforeRoute as noteBeforeRoute } from 'teespace-note-app';
import { WindowMail, beforeRoute as mailBeforeRoute } from 'teespace-mail-app';
import { Prompt } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Observer } from 'mobx-react';
import SpaceSide from '../components/main/SpaceSide';
import LeftSide from '../components/main/LeftSide';
import MainSide from '../components/main/MainSide';
import { Loader, Wrapper } from './MainPageStyle';
import { useStores } from '../stores';
import LoadingImg from '../assets/WAPL_Loading.gif';
import FaviconChanger from '../components/common/FaviconChanger';
import WindowManager from '../components/common/WindowManager';
import { getMainURL, getQueryParams, getQueryString } from '../utils/UrlUtil';
import { handleProfileMenuClick } from '../utils/ProfileUtil';
import { NotificationCenter } from '../components/notificationCenter';
import { useInitialize } from '../hook';
// import Est from '../components/common/Est';

const MainPage = () => {
  const { t } = useTranslation();
  const { uiStore, historyStore } = useStores();
  const history = useHistory();
  const { resourceType, resourceId, mainApp } = useParams();
  const { sub: subApp } = getQueryParams(history.location.search);

  const { roomStore, userStore, configStore } = useCoreStores();
  const myUserId = userStore.myProfile.id;

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

  // 기본 data fetch
  const isLoaded = useInitialize();

  // 묶어 놓으면, 하나 바뀔때도 다 바뀜
  useEffect(() => {
    uiStore.resourceType = resourceType;
    uiStore.tabType = resourceType;
  }, [uiStore, resourceType]);

  useEffect(() => {
    if (resourceType === 'm' && isLoaded) {
      const { roomInfo } = roomStore.getDMRoom(myUserId, myUserId);
      if (roomInfo) uiStore.resourceId = roomInfo.id;
    } else {
      uiStore.resourceId = resourceId;
    }
  }, [uiStore, isLoaded, resourceId, resourceType, myUserId, roomStore]);

  useEffect(() => {
    uiStore.mainApp = mainApp;
  }, [uiStore, mainApp]);

  useEffect(() => {
    uiStore.subApp = subApp;
    if (!subApp) uiStore.layout = 'close';
    else uiStore.layout = 'collapse';
  }, [uiStore, subApp]);

  const handleSystemMessage = message => {
    const resType = uiStore.resourceType;
    const resId = uiStore.resourceId;

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
      uiStore.layout = 'full';
    });
    const expandHandler = EventBus.on('onLayoutExpand', () => {
      uiStore.layout = 'expand';
    });
    const collapseHandler = EventBus.on('onLayoutCollapse', () => {
      uiStore.layout = 'collapse';
    });
    const closeHandler = EventBus.on('onLayoutClose', () => {
      const queryParams = getQueryParams();
      delete queryParams.sub;
      const queryString = getQueryString(queryParams);

      history.push(`${history.location.pathname}?${queryString}`);
    });
    const openMeetingHandler = EventBus.on('onMeetingOpen', ({ roomId }) => {
      uiStore.openWindow({
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
            uiStore.openToast({
              text: t('TEMP_GUEST_ACCESS_DENIED'),
              onClose: () => uiStore.closeToast(),
            });
            break;
          default:
            break;
        }
      },
    );

    const roomSettingHandler = EventBus.on(
      'Platform:roomSetting',
      ({ roomId, mainTab, subTab }) => {
        let messageText;
        const targetRoom = roomStore.getRoom(roomId);

        // 룸이 없는 경우
        if (!targetRoom) messageText = t('CM_INVALID_ROOM');
        // 더 이상 룸 관리자가 아니거나 프라이빗 룸으로 전환한 경우
        else if (
          targetRoom.adminId !== myUserId ||
          targetRoom.type !== 'WKS0003'
        )
          messageText = t('CM_SERVICE_ALARM_BUTTON_10');

        if (messageText) {
          uiStore.openMessage({
            title: messageText,
            buttons: [
              {
                type: 'solid',
                shape: 'round',
                text: t('CM_LOGIN_POLICY_03'),
                onClick: () => {
                  uiStore.isMessageVisible = false;
                },
              },
            ],
          });
          return;
        }

        history.push(`/s/${roomId}/setting`, { mainTab, subTab });
      },
    );

    const directMessageHandler = EventBus.on(
      'Platform:directMessage',
      ({ userId }) => {
        uiStore.tabType = 's';
        const moveTalk = roomId => history.push(`/s/${roomId}/talk`);

        handleProfileMenuClick(
          myUserId,
          userId,
          async roomInfo => {
            const { lastUrl } = await historyStore.getHistory({
              roomId: roomInfo.id,
            });

            if (lastUrl) history.push(lastUrl);
            else moveTalk(roomInfo.id);
          },
          roomInfo => {
            moveTalk(roomInfo.id);
          },
        );
      },
    );

    const updateURLHandler = EventBus.on('Platform:updateURL', ({ domain }) => {
      uiStore.openMessage({
        title: t('CM_LOGIN_POLICY_10'),
        subTitle: t('CM_LOGIN_POLICY_11'),
        type: 'warning',
        buttons: [
          {
            type: 'outlined',
            shape: 'round',
            text: t('CM_LOGIN_POLICY_03'),
            onClick: () => {
              uiStore.closeMessage();
              window.location.href = `${
                window.location.protocol
              }//${domain}.${getMainURL()}`;
            },
          },
        ],
      });
    });

    const openToastHandler = EventBus.on('Platform:openToast', ({ text }) => {
      uiStore.openToast({
        text,
      });
    });

    WWMS.addHandler('SYSTEM', 'platform_wwms', handleSystemMessage);

    return () => {
      EventBus.off('onLayoutFull', fullHandler);
      EventBus.off('onLayoutExpand', expandHandler);
      EventBus.off('onLayoutCollapse', collapseHandler);
      EventBus.off('onLayoutClose', closeHandler);
      EventBus.off('onMeetingOpen', openMeetingHandler);
      EventBus.off('CoreRequest:forbidden', errorHandler);
      EventBus.off('Platform:banMembers', roomSettingHandler);
      EventBus.off('Platform:directMessage', directMessageHandler);
      EventBus.off('Platform:updateURL', updateURLHandler);
      EventBus.off('Platform:openToast', openToastHandler);
      WWMS.removeHandler('SYSTEM', 'platform_wwms');
    };
  }, []);

  const leftSide = useMemo(() => <LeftSide />, []);
  const mainSide = useMemo(() => <MainSide />, []);

  const saveHistory = location => {
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

    const historyInfo = {
      userId: myUserId,
      roomId: currentResourceId,
      lastUrl: `${pathname}${search}`,
      appInfo: `${currentMainApp || ''}/${currentSubApp || ''}`,
    };

    userStore.updateRoutingHistory(historyInfo);
    historyStore.updateHistory({ history: historyInfo });
  };

  const isRunning = appName => {
    return mainApp === appName || subApp === appName;
  };

  const beforeRoute = (location, action) => {
    let isRoutable = true;

    isRoutable = mailBeforeRoute(location, action); // true false:(mail쓰기)

    // 각 앱의 beforeRoute 를 받아서 처리하자.
    if (isRunning('note'))
      isRoutable = isRoutable && noteBeforeRoute(location, action);

    // 메일팀 요청
    if (isRoutable) {
      isRoutable = mailBeforeRoute(location, action);
    }

    if (isRunning('meeting')) {
      if (uiStore.subAppState === AppState.RUNNING) {
        // NOTE. 미팅앱에서 빠져 나갈 것인지 묻는 상태로 진입
        uiStore.subAppState = AppState.BEFORE_STOP;
        uiStore.nextLocation = location;
        isRoutable = false;
      } else if (uiStore.subAppState === AppState.STOPPED) {
        // NOTE. 미팅의 경우 라우팅이 변경될 때 토크 상태의 히스토리가 저장되어야 함.
        //  그렇지 않으면 이 방에 들어올 때마다 미팅이 실행됨.
        saveHistory({ ...history.location, search: '' });
      } else {
        // DO NOTHING
      }
    }

    if (isRoutable) {
      saveHistory(location);

      // NOTE. 서브앱으로 라우팅되는 경우 초기화 진행중 상태로 진입됨.
      if (!subApp) {
        uiStore.subAppState = AppState.INITIALIZING;
      }
    }
    return isRoutable;
  };

  return !isLoaded ? (
    <Loader>
      <img src={LoadingImg} alt="loader" />
    </Loader>
  ) : (
    <Wrapper>
      {/* Notification Center */}
      <Observer>
        {() => (
          <NotificationCenter
            visible={uiStore.isNotificationCenterVisible}
            onClose={() => {
              uiStore.isNotificationCenterVisible = false;
            }}
          />
        )}
      </Observer>

      {/* Common Toast */}
      <Observer>
        {() => (
          <Toast
            visible={uiStore.isToastVisible}
            timeoutMs={uiStore.toastTimeout}
            links={uiStore.toastLinks}
            size={uiStore.toastSize}
            onClose={uiStore.toastOnClose}
          >
            {uiStore.toastText}
          </Toast>
        )}
      </Observer>

      {/* Common Message */}
      <Observer>
        {() => (
          <Message
            visible={uiStore.isMessageVisible}
            type={uiStore.messageType}
            title={uiStore.messageTitle}
            subtitle={uiStore.messageSubTitle}
            btns={uiStore.messageButton}
            customBadge={uiStore.messageCustomBadge}
          />
        )}
      </Observer>

      {/* Favicon Changer */}
      <FaviconChanger />

      {/* Window Manager */}
      <WindowManager />
      <WindowMail />

      {/* <Observer>{() => <Est visible={uiStore.isEstVisible} />}</Observer> */}
      {/* History Save */}
      <Prompt
        message={(location, action) => {
          return beforeRoute(location, action);
        }}
      />

      {!configStore.isFromCNU ? <SpaceSide /> : null}
      {leftSide}
      {mainSide}
    </Wrapper>
  );
};

export default MainPage;
