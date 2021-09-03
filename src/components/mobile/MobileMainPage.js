import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { EventBus, useCoreStores, Message } from 'teespace-core';
import { useTranslation } from 'react-i18next';
import { Observer } from 'mobx-react';
import styled from 'styled-components';
import { useStores } from '../../stores';
import MobileContent from './MobileContent';
import MobileFooter from './MobileFooter';
import LoadingImg from '../../assets/WAPL_Loading.gif';

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

const MobileMainPage = () => {
  const { resourceType, resourceId } = useParams();
  const { i18n } = useTranslation();
  const { uiStore } = useStores();
  const { spaceStore, userStore, friendStore, roomStore } = useCoreStores();
  const [isLoading, setIsLoading] = useState(true);
  const myUserId = userStore.myProfile.id;

  useEffect(() => {
    Promise.all([
      spaceStore.fetchSpaces({
        userId: myUserId,
        isLocal: process.env.REACT_APP_ENV === 'local',
      }),
      userStore.fetchRoomUserProfileList({}),
      friendStore.fetchFriends(),
      roomStore.fetchRoomList(),
      roomStore.fetchOpenRoomList(),
      userStore.getMyDomainSetting(),
    ]).then(async () => {
      EventBus.dispatch('Platform:initLNB');

      if (!userStore.myDomainSetting.language) {
        await userStore.updateMyDomainSetting({
          language: i18n.language,
        });
      } else i18n.changeLanguage(userStore.myDomainSetting.language);

      setIsLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    uiStore.resourceType = resourceType;
    uiStore.resourceId = resourceId;
  }, [uiStore, resourceType, resourceId]);

  if (isLoading) {
    return (
      <Loader>
        <img src={LoadingImg} alt="loading" />
      </Loader>
    );
  }

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
          <Message
            visible={uiStore.isMessageVisible}
            type={uiStore.messageType}
            roomInfo={uiStore.roomInfo}
            isOpenRoom={uiStore.isOpenRoom}
            title={uiStore.messageTitle}
            subtitle={uiStore.messageSubTitle}
            btns={uiStore.messageButton}
            customBadge={uiStore.messageCustomBadge}
          />
        )}
      </Observer>
    </Wrapper>
  );
};

export default MobileMainPage;
