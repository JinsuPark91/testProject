import React from 'react';
import { useObserver } from 'mobx-react';
import { MailSideView } from 'teespace-mail-app';
import { talkRoomStore } from 'teespace-talk-app';
import { ChattingIcon, MailIcon, PeopleIcon } from '../Icons';
import FriendLnb from '../friends/FriendsLNB';
import RoomList from '../Rooms/RoomList';
import { Wrapper, CustomTabs, UnreadCount, IconWrapper } from './LeftSideStyle';
import PlatformUIStore from '../../stores/PlatformUIStore';

const { TabPane } = CustomTabs;

const LeftSide = () => {
  const handleSelectTab = key => {
    PlatformUIStore.tabType = key;
  };

  return useObserver(() => (
    <Wrapper>
      <CustomTabs
        activeKey={PlatformUIStore.tabType}
        onTabClick={handleSelectTab}
        animated={false}
      >
        <TabPane
          key="f"
          tab={
            <IconWrapper className="lnb__icon-wrapper">
              <PeopleIcon
                width={1.5}
                height={1.5}
                color={PlatformUIStore.tabType === 'f' ? '#232d3b' : '#ffffff'}
                tooltipText="프렌즈 목록"
              />
            </IconWrapper>
          }
        >
          <FriendLnb />
        </TabPane>

        <TabPane
          key="s"
          tab={
            <IconWrapper className="lnb__icon-wrapper">
              {talkRoomStore.totalUnreadCount && (
                <UnreadCount>{talkRoomStore.totalUnreadCount}</UnreadCount>
              )}
              <ChattingIcon
                width={1.5}
                height={1.5}
                color={PlatformUIStore.tabType === 's' ? '#232d3b' : '#ffffff'}
                tooltipText="룸 목록"
              />
            </IconWrapper>
          }
        >
          <RoomList />
        </TabPane>

        <TabPane
          key="m"
          tab={
            <IconWrapper className="lnb__icon-wrapper">
              <MailIcon
                width={1.5}
                height={1.5}
                color={PlatformUIStore.tabType === 'm' ? '#232d3b' : '#ffffff'}
                tooltipText="Mail"
              />
            </IconWrapper>
          }
        >
          <MailSideView />
        </TabPane>
      </CustomTabs>
    </Wrapper>
  ));
};

export default LeftSide;
