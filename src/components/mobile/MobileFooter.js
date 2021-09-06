import React from 'react';
import { useHistory } from 'react-router-dom';
import { Observer } from 'mobx-react';
import { useStores } from '../../stores';
import {
  Wrapper,
  NewBadge,
  IconWrapper,
  FooterTab,
} from './style/MobileFooterStyle';
import { ChattingIcon } from '../Icons';
import { FriendsIcon } from './Icon';

const { TabPane } = FooterTab;

const MobileFooter = () => {
  const { uiStore } = useStores();
  const history = useHistory();

  const handleSelectTab = key => history.push(`/${key}`);

  const newBadgeView = number => {
    if (!number || number <= 0) return null;
    return <NewBadge>{number > 99 ? '99+' : number}</NewBadge>;
  };

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

export default React.memo(MobileFooter);
