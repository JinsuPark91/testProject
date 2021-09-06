import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import {
  EventBus,
  WWMS,
  useCoreStores,
  MobileMessage,
  MobileToast,
} from 'teespace-core';
import { useTranslation } from 'react-i18next';
import { Observer } from 'mobx-react';
import styled from 'styled-components';
import { useStores } from '../../stores';
import MobileContent from './MobileContent';
import MobileFooter from './MobileFooter';
import MobileLoader from './MobileLoader';

const MobileMainPage = () => {
  const { resourceType, resourceId } = useParams();
  const { t, i18n } = useTranslation();
  const { spaceStore, userStore, friendStore, roomStore } = useCoreStores();
  const { uiStore } = useStores();
  const history = useHistory();

  const [loading, setLoading] = useState(true);
  const myUserId = userStore.myProfile.id;

  useEffect(() => {
    Promise.all([
      spaceStore.fetchSpaces({
        userId: myUserId,
        isLocal: process.env.REACT_APP_ENV === 'local',
      }),
      roomStore.fetchRoomList(),
      userStore.fetchRoomUserProfileList({}),
      friendStore.fetchFriends(),
      userStore.getMyDomainSetting(),
    ]).then(async () => {
      EventBus.dispatch('Platform:initLNB');

      if (!userStore.myDomainSetting.language) {
        await userStore.updateMyDomainSetting({
          language: i18n.language,
        });
      } else i18n.changeLanguage(userStore.myDomainSetting.language);

      setLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // TODO: 정기배포에서 MainPage에 있는 코드와 비교하여 중복 제거
  useEffect(() => {
    const roomSettingHandler = EventBus.on(
      'Platform:roomSetting',
      ({ roomId, mainTab, subTab }) => {
        let messageText;
        const targetRoom = roomStore.getRoom(roomId);

        // console.log(roomId, 'member', 'request');

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
                onClick: () => uiStore.closeMessage(),
              },
            ],
          });
          return;
        }

        history.push(`/memberManagement/${roomId}`, { mainTab, subTab });
      },
    );

    const handleSystemMessage = message => {
      const resType = uiStore.resourceType;
      const resId = uiStore.resourceId;

      switch (message.NOTI_TYPE) {
        // 유저 탈퇴
        case 'deleteFriend': {
          if (resType === 'friend' && resId === message.USER_ID)
            history.push(`/friend`);
          break;
        }
        // 강퇴 또는 나가기
        case 'exitRoom':
        case 'deleteRoom': {
          if (resType === 'talk' && resId === message.SPACE_ID)
            history.push(`/room`);
          break;
        }
        default:
          break;
      }
    };

    WWMS.addHandler('SYSTEM', 'platform_wwms', handleSystemMessage);

    return () => {
      EventBus.off('Platform:roomSetting', roomSettingHandler);
      WWMS.removeHandler('SYSTEM', 'platform_wwms');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    uiStore.resourceType = resourceType;
    uiStore.resourceId = resourceId;
  }, [uiStore, resourceType, resourceId]);

  if (loading) return <MobileLoader />;

  return (
    <Wrapper>
      <MobileContent />
      <Observer>
        {() => {
          if (uiStore.isFooterVisible()) return <MobileFooter />;
          return null;
        }}
      </Observer>

      <Observer>
        {() => (
          <MobileMessage
            visible={uiStore.isMessageVisible}
            type={uiStore.messageType}
            title={uiStore.messageTitle}
            subtitle={uiStore.messageSubTitle}
            btns={uiStore.messageButton}
            customBadge={uiStore.messageCustomBadge}
          />
        )}
      </Observer>
      <Observer>
        {() => (
          <MobileToast
            visible={uiStore.isToastVisible}
            timeoutMs={uiStore.toastTimeout}
            links={uiStore.toastLinks}
            size={uiStore.toastSize}
            onClose={uiStore.toastOnClose}
          >
            {uiStore.toastText}
          </MobileToast>
        )}
      </Observer>
    </Wrapper>
  );
};

export default MobileMainPage;

const Wrapper = styled.div`
  height: 100%;
`;
const Loader = styled.div`
  display: flex;
  height: 100%;
  justify-content: center;
  align-items: center;
  user-select: none;

  & img {
    width: 5rem;
    height: auto;
  }
`;
