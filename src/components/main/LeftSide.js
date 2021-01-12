import React from 'react';
import { useObserver } from 'mobx-react';
import { MailSideView } from 'teespace-mail-app';
import { talkRoomStore } from 'teespace-talk-app';
import { ChattingIcon, MailIcon, PeopleIcon } from '../Icons';
import FriendLnb from '../friends/FriendsLNB';
import RoomList from '../Rooms/RoomList';
import { Wrapper, CustomTabs, UnreadCount } from './LeftSideStyle';
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
        <TabPane key="f" tab={<PeopleIcon tooltipText="프렌즈 목록" />}>
          <FriendLnb />
        </TabPane>

        <TabPane
          key="s"
          tab={
            <>
              {talkRoomStore.totalUnreadCount && (
                <UnreadCount>{talkRoomStore.totalUnreadCount}</UnreadCount>
              )}
              <ChattingIcon tooltipText="룸 목록" />
            </>
          }
        >
          <RoomList />
        </TabPane>

        <TabPane key="m" tab={<MailIcon tooltipText="Mail" />}>
          <MailSideView />
        </TabPane>
      </CustomTabs>
    </Wrapper>
  ));
};

export default LeftSide;
