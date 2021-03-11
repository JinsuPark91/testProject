import React from 'react';
import { useHistory } from 'react-router-dom';
import { Observer } from 'mobx-react';
import { useCoreStores } from 'teespace-core';
import styled from 'styled-components';
import { Tabs } from 'antd';
import { ChattingIcon } from '../Icons';
import { FriendsIcon } from './Icon';
import PlatformUIStore from '../../stores/PlatformUIStore';
import { handleCheckNewFriend } from '../../utils/FriendsUtil';

const Wrapper = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
`;

const NewBadge = styled.div`
  display: ${({ isVisible }) => (isVisible ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
  padding: 0 0.25rem;
  position: absolute;
  top: 0.31rem;
  left: 50%;
  margin-left: 0.75rem;
  font-size: 0.69rem;
  font-weight: 400;
  color: #fff;
  border-radius: 0.56rem;
  background-color: #dc4547;
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 5.13rem;
  height: 2.75rem;
  border-radius: 10px;
`;

const FooterTab = styled(Tabs)`
  &.ant-tabs {
    width: 100%;
  }
  .ant-tabs-content {
    border-right: 1px solid #ddd9d4;
    box-sizing: border-box;
    -webkit-box-sizing: border-box;
  }
  .ant-tabs-nav {
    margin: 0;
    .ant-tabs-ink-bar {
      height: 0;
    }
  }
  .ant-tabs-nav-list {
    flex: 1;
    background-color: #f2ede6;
  }

  .ant-tabs-nav-operations {
    display: none !important;
  }
  .ant-tabs-tab {
    width: calc(100% / 2);
    justify-content: center;
    margin: 0;
    padding: 0;
    height: 3.13rem;
    background-color: #f2ede6;
    font-size: 0;
    &:hover:not(.ant-tabs-tab-active) {
      .icon-wrapper {
        background-color: #f2ede6;
      }
    }
  }

  .ant-tabs-tab-active .icon-wrapper {
    background-color: #f2ede6;
  }
`;

const { TabPane } = FooterTab;

const MobileFooter = () => {
  const history = useHistory();
  const { userStore, friendStore, roomStore } = useCoreStores();
  const myUserId = userStore.myProfile.id;

  const handleSelectTab = key => {
    history.push(`/${key}/${myUserId}`);
  };

  const newBadgeView = number => {
    return (
      <NewBadge isVisible={number > 0}>{number > 99 ? '99+' : number}</NewBadge>
    );
  };

  return (
    <Wrapper>
      <FooterTab
        activeKey={PlatformUIStore.resourceType}
        onTabClick={handleSelectTab}
        animated={false}
      >
        <TabPane
          key="friend"
          tab={
            <IconWrapper className="icon-wrapper">
              <Observer>
                {() => {
                  const newFriendNum = friendStore.friendInfoList?.filter(
                    elem => handleCheckNewFriend(elem),
                  ).length;
                  return newBadgeView(newFriendNum);
                }}
              </Observer>
              <FriendsIcon width={1.75} height={1.75} />
            </IconWrapper>
          }
        />
        <TabPane
          key="room"
          tab={
            <IconWrapper className="icon-wrapper">
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
                  return newBadgeView(PlatformUIStore.totalUnreadCount);
                }}
              </Observer>
              <ChattingIcon width={1.5} height={1.5} color="#7B7671" />
            </IconWrapper>
          }
        />
        {/* <TabPane
          key="select"
          tab={
            <IconWrapper className="icon-wrapper">
              <ChattingIcon width={1.5} height={1.5} />
            </IconWrapper>
          }
        /> */}
      </FooterTab>
    </Wrapper>
  );
};

export default MobileFooter;
