import React from 'react';
import { observer, Observer } from 'mobx-react';
import { useCoreStores, logEvent } from 'teespace-core';
import { MailSideView } from 'teespace-mail-app';
import { useTranslation } from 'react-i18next';
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
import PlatformUIStore from '../../stores/PlatformUIStore';

const { TabPane } = CustomTabs;

const LeftSide = observer(() => {
  const { t, i18n } = useTranslation();
  const { roomStore, friendStore } = useCoreStores();
  const newFriendNum = friendStore.friendInfoList?.filter(elem =>
    handleCheckNewFriend(elem),
  ).length;

  const scrollTop = key => {
    const idMap = {
      f: 'lnb__friend-container',
      s: 'lnb__room-container',
      m: '',
    };

    const container = document.getElementById(idMap[key]);
    if (container) {
      container.scrollTo(0, 0);
    }
  };

  const handleSelectTab = key => {
    if (key !== 'f')
      document.getElementById('lnb__friend-container').scrollTo(0, 0);
    PlatformUIStore.tabType = key;
    if (key === 'm') logEvent('gnb', 'clickTeeMailBtn');
    scrollTop(key);
  };

  return (
    <Wrapper>
      <CustomTabs
        activeKey={PlatformUIStore.tabType}
        onTabClick={handleSelectTab}
        animated={false}
      >
        <TabPane
          key="f"
          tab={
            <Tooltip
              title={t('CM_FRIENDS_LIST')}
              placement="bottom"
              color="#4C535D"
            >
              <IconWrapper className="lnb__icon-wrapper lnb__friends">
                <UnreadCount isVisible={newFriendNum > 0}>
                  {newFriendNum}
                </UnreadCount>
                {PlatformUIStore.tabType === 'f' ? (
                  <PeopleActiveIcon width={1.5} height={1.5} />
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
              color="#4C535D"
            >
              <IconWrapper className="lnb__icon-wrapper lnb__rooms">
                <Observer>
                  {() => {
                    PlatformUIStore.totalUnreadCount = roomStore
                      .getRoomArray()
                      .filter(roomInfo => roomInfo.isVisible)
                      .reduce(
                        (accumulator, roomInfo) =>
                          accumulator +
                          parseInt(roomInfo.metadata.count ?? '0', 10),
                        0,
                      );
                    return (
                      <UnreadCount
                        isVisible={PlatformUIStore.totalUnreadCount > 0}
                      >
                        {PlatformUIStore.totalUnreadCount > 99
                          ? '99+'
                          : PlatformUIStore.totalUnreadCount}
                      </UnreadCount>
                    );
                  }}
                </Observer>
                {PlatformUIStore.tabType === 's' ? (
                  <ChattingActiveIcon width={1.5} height={1.5} />
                ) : (
                  <ChattingIcon width={1.5} height={1.5} />
                )}
              </IconWrapper>
            </Tooltip>
          }
        >
          <RoomList />
        </TabPane>

        <TabPane
          key="m"
          tab={
            <Tooltip
              title={t('CM_COMMUNICATION_BAR_03')}
              placement="bottom"
              color="#4C535D"
            >
              <IconWrapper className="lnb__icon-wrapper lnb__mail">
                <UnreadCount isVisible={false}>N</UnreadCount>
                {PlatformUIStore.tabType === 'm' ? (
                  <MailActiveIcon width={1.5} height={1.5} />
                ) : (
                  <MailIcon width={1.5} height={1.5} />
                )}
              </IconWrapper>
            </Tooltip>
          }
        >
          <MailSideView language={i18n.language} />
        </TabPane>
      </CustomTabs>
    </Wrapper>
  );
});

export default LeftSide;
