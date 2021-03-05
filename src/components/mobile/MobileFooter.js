import React from 'react';
import { useHistory } from 'react-router-dom';
import { Observer } from 'mobx-react';
import { useCoreStores } from 'teespace-core';
import styled from 'styled-components';
import { Tabs } from 'antd';
import { ChattingIcon } from '../Icons';
import PlatformUIStore from '../../stores/PlatformUIStore';

const Wrapper = styled.div``;

const UnreadCount = styled.div`
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
    background-color: #232d3b;
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
    background-color: #232d3b;
    font-size: 0;
    &:hover:not(.ant-tabs-tab-active) {
      .lnb__icon-wrapper {
        background-color: #313a46;
      }
    }
  }

  .ant-tabs-tab-active .lnb__icon-wrapper {
    background-color: #fff;
  }
`;

const { TabPane } = FooterTab;

const MobileFooter = () => {
  const history = useHistory();
  const { userStore, roomStore } = useCoreStores();
  const myUserId = userStore.myProfile.id;

  const handleSelectTab = key => {
    history.push(`/${key}/${myUserId}`);
    PlatformUIStore.resourceType = key;
  };

  return (
    <Wrapper>
      <FooterTab
        activeKey={PlatformUIStore.resourceType}
        onTabClick={handleSelectTab}
        animated={false}
      >
        <TabPane
          key="room"
          tab={
            <IconWrapper className="lnb__icon-wrapper">
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

              <ChattingIcon width={1.5} height={1.5} />
            </IconWrapper>
          }
        />
        <TabPane
          key="select"
          tab={
            <IconWrapper className="lnb__icon-wrapper">
              <ChattingIcon width={1.5} height={1.5} />
            </IconWrapper>
          }
        />
      </FooterTab>
    </Wrapper>
  );
};

export default MobileFooter;
