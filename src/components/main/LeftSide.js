import React from 'react';
import { observer } from 'mobx-react';
import { useCoreStores } from 'teespace-core';
import { MailSideView } from 'teespace-mail-app';
import { ChattingIcon, MailIcon, PeopleIcon } from '../Icons';
import FriendLnb from '../friends/FriendsLNB';
import RoomList from '../Rooms/RoomList';
import { Wrapper, CustomTabs, UnreadCount, IconWrapper } from './LeftSideStyle';
import PlatformUIStore from '../../stores/PlatformUIStore';

const { TabPane } = CustomTabs;

const LeftSide = observer(() => {
  const { roomStore } = useCoreStores();

  const handleSelectTab = key => {
    PlatformUIStore.tabType = key;
  };

  const totalUnreadCount = roomStore
    .getRoomArray()
    .filter(roomInfo => roomInfo.isVisible)
    .reduce(
      (accumulator, roomInfo) =>
        accumulator + parseInt(roomInfo.metadata?.count ?? '0', 10),
      0,
    );

  console.log(totalUnreadCount);
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
              <UnreadCount isVisible={totalUnreadCount > 0}>
                {totalUnreadCount > 99 ? '99+' : totalUnreadCount}
              </UnreadCount>
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
              <UnreadCount isVisible={false}>N</UnreadCount>
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
  );
});

export default LeftSide;
