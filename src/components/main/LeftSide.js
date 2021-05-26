import React, { useContext } from 'react';
import { Observer } from 'mobx-react';
import { useCoreStores, logEvent, EventBus } from 'teespace-core';
import { MailSideView, MailStore } from 'teespace-mail-app';
import { useTranslation } from 'react-i18next';
import { ThemeContext } from 'styled-components';
import { Tooltip } from 'antd';
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
import { handleCheckNewFriend } from '../../utils/FriendsUtil';
import { Wrapper, CustomTabs, UnreadCount, IconWrapper } from './LeftSideStyle';
import { useStores } from '../../stores';

const { TabPane } = CustomTabs;

const LeftSide = () => {
  const { t, i18n } = useTranslation();
  const { uiStore } = useStores();
  const { roomStore, friendStore, configStore } = useCoreStores();

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

  const themeContext = useContext(ThemeContext);

  return (
    <Wrapper>
      <Observer>
        {() => (
          <CustomTabs
            activeKey={uiStore.tabType}
            onTabClick={handleSelectTab}
            animated={false}
          >
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
                      {() => {
                        const newFriendNum = friendStore.friendInfoList?.filter(
                          elem => handleCheckNewFriend(elem),
                        ).length;

                        return (
                          <UnreadCount isVisible={newFriendNum > 0}>
                            {newFriendNum}
                          </UnreadCount>
                        );
                      }}
                    </Observer>
                    {uiStore.tabType === 'f' ? (
                      <PeopleActiveIcon
                        width={1.5}
                        height={1.5}
                        color={themeContext.BasicDark}
                      />
                    ) : (
                      <PeopleIcon width={1.5} height={1.5} />
                    )}
                  </IconWrapper>
                </Tooltip>
              }
            >
              <FriendLnb />
            </TabPane>

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
                      {() => {
                        uiStore.totalUnreadCount = roomStore
                          .getRoomArray()
                          .filter(roomInfo => roomInfo.isVisible)
                          .reduce(
                            (accumulator, roomInfo) =>
                              accumulator +
                              parseInt(roomInfo.metadata.count ?? '0', 10),
                            0,
                          );
                        return (
                          <UnreadCount isVisible={uiStore.totalUnreadCount > 0}>
                            {uiStore.totalUnreadCount > 99
                              ? '99+'
                              : uiStore.totalUnreadCount}
                          </UnreadCount>
                        );
                      }}
                    </Observer>
                    {uiStore.tabType === 's' ? (
                      <ChattingActiveIcon
                        width={1.5}
                        height={1.5}
                        color={themeContext.BasicDark}
                      />
                    ) : (
                      <ChattingIcon width={1.5} height={1.5} />
                    )}
                  </IconWrapper>
                </Tooltip>
              }
            >
              <RoomList />
            </TabPane>
            {configStore.isActivateForCNU('Mail') ? (
              <TabPane
                key="m"
                tab={
                  <Tooltip
                    title={t('CM_COMMUNICATION_BAR_03')}
                    placement="bottom"
                    color={themeContext.CoreLight}
                  >
                    <IconWrapper className="lnb__icon-wrapper lnb__mail">
                      <UnreadCount isVisible={MailStore.unreadTotalCount > 0}>
                        {MailStore.unreadTotalCount > 99
                          ? '99+'
                          : MailStore.unreadTotalCount}
                      </UnreadCount>
                      {uiStore.tabType === 'm' ? (
                        <MailActiveIcon
                          width={1.5}
                          height={1.5}
                          color={themeContext.BasicDark}
                        />
                      ) : (
                        <MailIcon width={1.5} height={1.5} />
                      )}
                    </IconWrapper>
                  </Tooltip>
                }
              >
                <MailSideView language={i18n.language} />
              </TabPane>
            ) : null}
          </CustomTabs>
        )}
      </Observer>
    </Wrapper>
  );
};

export default LeftSide;
