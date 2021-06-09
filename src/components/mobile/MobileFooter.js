import React from 'react';
import { useHistory } from 'react-router-dom';
import { Observer } from 'mobx-react';
import { useCoreStores } from 'teespace-core';
import styled from 'styled-components';
import { Tabs } from 'antd';
import { ChattingIcon } from '../Icons';
import { FriendsIcon } from './Icon';
import { useStores } from '../../stores';

const Wrapper = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
`;

const NewBadge = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 0.5rem;
  right: 1.4rem;
  padding: 0 0.25rem;
  min-width: 1rem;
  min-height: 1rem;
  line-height: 1;
  font-size: 0.56rem;
  color: #fff;
  font-weight: 400;
  border-radius: 50%;
  background-color: #dc4547;
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 5.63rem;
  height: 3.13rem;
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
  const { uiStore } = useStores();
  const { userStore } = useCoreStores();
  const history = useHistory();
  const myUserId = userStore.myProfile.id;

  const handleSelectTab = key => history.push(`/${key}/${myUserId}`);

  const newBadgeView = number => {
    if (number <= 0) return null;
    return <NewBadge>{number > 99 ? '99+' : number}</NewBadge>;
  };

  if (uiStore.isProfileEditMode) return null;

  return (
    <Wrapper>
      <FooterTab
        activeKey={uiStore.resourceType}
        onTabClick={handleSelectTab}
        animated={false}
      >
        <TabPane
          key="friend"
          tab={
            <IconWrapper className="icon-wrapper">
              <Observer>
                {() => {
                  return newBadgeView(uiStore.newFriendCount);
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
                  return newBadgeView(uiStore.totalUnreadCount);
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
