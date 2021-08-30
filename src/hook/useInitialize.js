import { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useCoreStores, EventBus, AlarmSetting, WWMS } from 'teespace-core';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { useStores } from '../stores';
import { isDarkMode } from '../utils/GeneralUtil';
import { handleProfileMenuClick } from '../utils/ProfileUtil';
import openRoomModal from '../utils/OpenRoomUtil';

const useInitialize = () => {
  const { spaceStore, roomStore, userStore, friendStore, themeStore } =
    useCoreStores();
  const { uiStore, historyStore } = useStores();
  const [isLoaded, setIsLoaded] = useState(false);

  const { i18n } = useTranslation();
  const { resourceType, resourceId } = useParams();
  const history = useHistory();

  const url = window.location.origin; //  http://xxx.dev.teespace.net
  const conURL = url.split(`//`)[1]; // xxx.dev.teespace.net
  const mainURL = conURL.slice(conURL.indexOf('.') + 1, conURL.length); // dev.teespace.net

  /**
   * /f/:userId?action=talk
   * /f/:userId?action=meeting
   * 위 주소로 각각 1:1 talk, 1:1 meeting 을 호출할 수 있음.
   */
  const query = new URLSearchParams(window.location.search);
  const profileAction = query.get('action'); // profile 용 action

  let domainName;
  [domainName] = url.split(`//`)[1].split(`.`);

  const myUserId = userStore.myProfile.id;

  const handleMoveTalkHistory = async roomInfo => {
    const { lastUrl } = await historyStore.getHistory({
      roomId: roomInfo.id,
    });
    if (lastUrl) history.push(lastUrl);
    else history.push(`/s/${roomInfo.id}/talk`);
  };
  const handleMoveTalk = roomInfo => history.push(`/s/${roomInfo.id}/talk`);

  const handleOpenMeeting = roomInfo => {
    uiStore.openWindow({
      id: roomInfo.id,
      type: 'meeting',
      name: null,
      userCount: null,
      handler: null,
    });
  };

  const handleMoveMeetingHistory = async roomInfo => {
    handleOpenMeeting(roomInfo);
    await handleMoveTalkHistory(roomInfo);
  };
  const handleMoveMeeting = roomInfo => {
    handleOpenMeeting(roomInfo);
    handleMoveTalk(roomInfo);
  };

  const handleTalkClick = async () => {
    handleProfileMenuClick(
      myUserId,
      resourceId,
      handleMoveTalkHistory,
      handleMoveTalk,
    );
  };
  const handleMeetingClick = async () => {
    handleProfileMenuClick(
      myUserId,
      resourceId,
      handleMoveMeetingHistory,
      handleMoveMeeting,
    );
  };

  const handleLastHistory = () => {
    const PROFILE = 'profile';
    const MAIL = 'mail';
    const { lastHistory } = historyStore;

    // 존재하는 유저인지 확인
    if (lastHistory.roomId?.includes(PROFILE)) {
      const userId = lastHistory.lastUrl?.split('/')[2];
      const found = friendStore.friendInfoList.find(
        elem => elem.friendId === userId,
      );

      if (!found) history.push(`/f/${myUserId}/profile`);
      else history.push(lastHistory.lastUrl);
    }
    // 메일의 경우 아직 처리할 부분 없음
    else if (lastHistory.roomId?.includes(MAIL)) {
      history.push(lastHistory.lastUrl);
    }
    // 입장 가능한 룸인지 확인
    else {
      const found = roomStore
        .getRoomArray(true)
        .find(elem => elem.id === lastHistory.roomId);

      if (!found) history.push(`/f/${myUserId}/profile`);
      else history.push(lastHistory.lastUrl);
    }
  };

  const handleError = () => {
    if (process.env.REACT_APP_ENV === 'local') {
      setTimeout(() => {
        history.push('/logout');
      }, 1000);
    } else
      window.location.href = `${window.location.protocol}//${mainURL}/domain/${domainName}`;
  };

  useEffect(() => {
    Promise.all([
      // 스페이스를 불러오자
      spaceStore.fetchSpaces({
        userId: myUserId,
        isLocal: process.env.REACT_APP_ENV === 'local',
      }),
      // 룸을 불러오자
      roomStore.fetchRoomList(),
      // 유저 프로필을 불러오자
      userStore.fetchRoomUserProfileList({}),
      // 프렌드 리스트를 불러오자
      friendStore.fetchFriends(),
      // 접속 정보를 불러오자.
      historyStore.fetchHistories(),
      // 알림 세팅을 불러오자
      userStore.getAlarmList(myUserId),
      // 언어, 테마 설정을 가져오자
      userStore.getMyDomainSetting(),
    ])
      .then(async res => {
        // roomStore fetch 후에 Talk init 하자 (lastMessage, unreadCount, ...)
        EventBus.dispatch('Platform:initLNB');

        // 알람 리스트 적용
        const [, , , , , alarmList] = res;
        AlarmSetting.initAlarmSet(alarmList);

        // 계정 langauge 적용. 없으면 브라우저 기본 langauge로 업데이트 한다.
        if (!userStore.myDomainSetting.language) {
          await userStore.updateMyDomainSetting({
            language: i18n.language,
          });
        } else i18n.changeLanguage(userStore.myDomainSetting.language);

        // 기본 테마 설정
        const platformTheme = userStore.myDomainSetting.theme;
        if (platformTheme && platformTheme !== 'system')
          themeStore.setTheme(platformTheme);
        else if (isDarkMode()) themeStore.setTheme('dark');

        // 스페이스 화면에서 1:1 Talk나 1:1 Meeting을 선택한 경우

        if (resourceType === 'f' && profileAction) {
          switch (profileAction) {
            case 'talk':
              handleTalkClick();
              break;
            case 'meeting':
              handleMeetingClick();
              break;
            default:
              break;
          }
        }
        // Works 설정이면 바로 웍스로 이동
        else if (window.env.REACT_APP_WORKS_ONLY === 'yes') {
          history.push('/works');
        }
        // NOTE : 마지막 접속 URL 로 Redirect 시킨다.
        else if (historyStore.lastHistory) handleLastHistory();

        if (resourceType === 's' && resourceId) {
          await roomStore.fetchOpenRoomList(myUserId);
          const openRoom = roomStore.getOpenRoomMap().get(resourceId);
          if (openRoom) {
            // 오픈룸 입장관련 함수 호출
            openRoomModal({ openRoom, history });
          } else {
            console.log('존재하지 않음!');
            // 존재하지 않음 페이지로 보내기
          }
        }
      })
      .then(() => {
        setIsLoaded(true);
      })
      .catch(err => {
        handleError();
        console.log(err);
      });

    // NOTE : RECONNECT 임시 처리
    WWMS.setOnReconnect(() => {
      Promise.all([
        roomStore.fetchRoomList(),
        spaceStore.fetchSpaces({
          userId: myUserId,
          isLocal: process.env.REACT_APP_ENV === 'local',
        }),
        friendStore.fetchFriends(),
      ])
        .then(() => {
          // NOTE: 이벤트명은 core에서 불릴 것 같지만, 플랫폼에서 불러줌
          EventBus.dispatch('Platform:reconnectWebSocket');
        })
        .catch(err => {
          handleError();
          console.log(err);
        });
    });
  }, []);

  return isLoaded;
};

export default useInitialize;
