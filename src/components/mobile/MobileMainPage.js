import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { observer, Observer } from 'mobx-react';
import { useCoreStores } from 'teespace-core';
import { talkRoomStore } from 'teespace-talk-app';
import styled from 'styled-components';
import { Tabs } from 'antd';
import MobileHeader from './MobileHeader';
import MobileContent from './MobileContent';
import LoadingImg from '../../assets/WAPL_Loading.gif';
import PlatformUIStore from '../../stores/PlatformUIStore';
import { IconWrapper, UnreadCount } from '../main/LeftSideStyle';
import { ChattingIcon } from '../Icons';

const Wrapper = styled.div`
  height: 100%;
`;
const Container = styled.div`
  padding-top: 3.1rem;
  height: 90%;
  overflow-y: scroll;
`;
const Footer = styled.div``;

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

const Loader = styled.div``;

const { TabPane } = FooterTab;

const MobileMainPage = observer(() => {
  const history = useHistory();
  const { resourceType, resourceId } = useParams();
  const { userStore, friendStore, roomStore } = useCoreStores();
  const [isLoading, setIsLoading] = useState(true);
  const myUserId = userStore.myProfile.id;

  useEffect(() => {
    Promise.all([
      userStore.fetchRoomUserProfileList({}),
      friendStore.fetchFriends({ myUserId }),
      roomStore.fetchRoomList({ myUserId }),
    ]).then(async () => {
      await talkRoomStore.initialize(myUserId);
      setIsLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    PlatformUIStore.resourceType = resourceType;
    PlatformUIStore.resourceId = resourceId;
  }, [resourceType, resourceId]);

  const handleSelectTab = key => {
    history.push(`/${key}/${myUserId}`);
    PlatformUIStore.resourceType = key;
  };

  if (isLoading) {
    return (
      <Loader>
        <img src={LoadingImg} alt="loading" />
      </Loader>
    );
  }

  return (
    <>
      <Wrapper>
        <Container>
          <MobileHeader />
          <MobileContent />
        </Container>
        <Footer>
          <FooterTab onTabClick={handleSelectTab} animated={false}>
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
          </FooterTab>
        </Footer>
      </Wrapper>
    </>
  );
});

export default MobileMainPage;
