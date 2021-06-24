import React, { useContext, useMemo, useCallback } from 'react';
import { Observer } from 'mobx-react';
import { useCoreStores, logEvent, EventBus, Tooltip } from 'teespace-core';
import { MailSideView, MailStore } from 'teespace-mail-app';
import { useTranslation } from 'react-i18next';
import { ThemeContext } from 'styled-components';
import {
  ChattingIcon,
  ChattingActiveIcon,
  MailIcon,
  MailActiveIcon,
  PeopleIcon,
  PeopleActiveIcon,
} from '../Icons';
import FriendLnb from '../friends/FriendsLNB';
import RoomList from '../Rooms/RoomList';
import { Wrapper, CustomTabs, UnreadCount, IconWrapper } from './LeftSideStyle';
import { useStores } from '../../stores';
import * as useCommand from '../../hook/Command';

const { TabPane } = CustomTabs;

const LeftSide = () => {
  const { t, i18n } = useTranslation();
  const { uiStore } = useStores();
  const { friendStore, configStore } = useCoreStores();

  const scrollTop = key => {
    const idMap = {
      f: 'lnb__friend-container',
      s: 'lnb__room-container',
    };

    const container = document.getElementById(idMap[key]);
    if (container) {
      container.scrollTo(0, 0);
    }
  };

  const handleSelectTab = key => {
    if (key !== 'f') {
      const friendContainer = document.getElementById('lnb__friend-container');
      if (friendContainer) friendContainer.scrollTo(0, 0);
    }

    uiStore.tabType = key;
    if (key === 'm') {
      EventBus.dispatch('Note:onEditClose');
      logEvent('gnb', 'clickTeeMailBtn');
    }
    scrollTop(key);
  };

  const handleOpenMail = useCallback(() => {
    handleSelectTab('m');
    EventBus.dispatch('Mail:Command:OpenMail');
  }, []);

  const themeContext = useContext(ThemeContext);

  const FriendTabPane = useMemo(() => (
    <TabPane
      key="f"
      tab={
        <Tooltip
          title={t('CM_FRIENDS_LIST')}
          placement="bottom"
          color={themeContext.CoreLight}
        >
          <IconWrapper className="lnb__icon-wrapper lnb__friends">
            <Observer>
              {() => (
                <UnreadCount isVisible={uiStore.newFriendCount > 0}>
                  {uiStore.newFriendCount}
                </UnreadCount>
              )}
            </Observer>

            <Observer>
              {() =>
                uiStore.tabType === 'f' ? (
                  <PeopleActiveIcon
                    width={1.5}
                    height={1.5}
                    color={themeContext.BasicDark}
                  />
                ) : (
                  <PeopleIcon width={1.5} height={1.5} />
                )
              }
            </Observer>
          </IconWrapper>
        </Tooltip>
      }
    >
      <FriendLnb />
    </TabPane>
  ));

  const RoomTabPane = useMemo(() => (
    <TabPane
      key="s"
      tab={
        <Tooltip
          title={t('CM_COMMUNICATION_BAR_02')}
          placement="bottom"
          color={themeContext.CoreLight}
        >
          <IconWrapper className="lnb__icon-wrapper lnb__rooms">
            <Observer>
              {() => (
                <UnreadCount isVisible={uiStore.totalUnreadCount > 0}>
                  {uiStore.totalUnreadCount > 99
                    ? '99+'
                    : uiStore.totalUnreadCount}
                </UnreadCount>
              )}
            </Observer>

            <Observer>
              {() =>
                uiStore.tabType === 's' ? (
                  <ChattingActiveIcon
                    width={1.5}
                    height={1.5}
                    color={themeContext.BasicDark}
                  />
                ) : (
                  <ChattingIcon width={1.5} height={1.5} />
                )
              }
            </Observer>
          </IconWrapper>
        </Tooltip>
      }
    >
      <RoomList />
    </TabPane>
  ));

  const MailTabPane = useMemo(() =>
    configStore.isActivateForCNU('Mail') ? (
      <TabPane
        key="m"
        tab={
          <Tooltip
            title={t('CM_COMMUNICATION_BAR_03')}
            placement="bottom"
            color={themeContext.CoreLight}
          >
            <IconWrapper className="lnb__icon-wrapper lnb__mail">
              <Observer>
                {() => (
                  <UnreadCount isVisible={MailStore.unreadTotalCount > 0}>
                    {MailStore.unreadTotalCount > 99
                      ? '99+'
                      : MailStore.unreadTotalCount}
                  </UnreadCount>
                )}
              </Observer>

              <Observer>
                {() =>
                  uiStore.tabType === 'm' ? (
                    <MailActiveIcon
                      width={1.5}
                      height={1.5}
                      color={themeContext.BasicDark}
                    />
                  ) : (
                    <MailIcon width={1.5} height={1.5} />
                  )
                }
              </Observer>
            </IconWrapper>
          </Tooltip>
        }
      >
        <MailSideView language={i18n.language} />
      </TabPane>
    ) : null,
  );

  useCommand.OpenApp('mail', handleOpenMail);

  return (
    <Wrapper>
      <Observer>
        {() => (
          <CustomTabs
            activeKey={uiStore.tabType}
            onTabClick={handleSelectTab}
            animated={false}
          >
            {FriendTabPane}
            {RoomTabPane}
            {MailTabPane}
          </CustomTabs>
        )}
      </Observer>
    </Wrapper>
  );
};

export default LeftSide;
