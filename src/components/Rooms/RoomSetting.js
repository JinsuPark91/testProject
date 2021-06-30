import React, { useEffect, useContext } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import styled, { ThemeContext } from 'styled-components';
import { Observer } from 'mobx-react';
import { Tabs } from 'antd';
import { useTranslation } from 'react-i18next';
import { useCoreStores } from 'teespace-core';
import { ArrowLeftIcon, CancelIcon } from '../Icons';
import { useStores } from '../../stores';
import MemberSettingPage from './MemberSettingPage';
import CommonSettingPage from './CommonSettingPage';

const { TabPane } = Tabs;

const RoomSetting = ({ roomId }) => {
  const { roomSettingStore: store } = useStores();
  const { roomStore } = useCoreStores();
  const { t } = useTranslation();
  const history = useHistory();
  const location = useLocation();
  const roomInfo = roomStore.getRoom(roomId);

  useEffect(() => {
    store.tabKey = location?.state?.mainTab || 'common';
    store.subTabKey = location?.state?.subTab || 'member';
  }, [location]);

  useEffect(() => {
    return () => {
      store.tabKey = 'common';
      store.subTabKey = 'member';
    };
  }, []);

  const handleClose = () => {
    history.push(`/s/${roomId}/talk`);
  };

  const handleTabChange = key => {
    store.changeTab(key);
  };

  const themeContext = useContext(ThemeContext);

  return roomInfo ? (
    <Wrapper>
      <Header>
        <Centered>
          <IconWrapper onClick={handleClose}>
            <ArrowLeftIcon
              width={1}
              height={1}
              color={themeContext.IconNormal2}
            />
          </IconWrapper>
          <TitleText>{t('CM_ROOM_SETTING')}</TitleText>
        </Centered>
        <CloseArea>
          <IconWrapper onClick={handleClose}>
            <CancelIcon width={1} height={1} color={themeContext.IconNormal} />
          </IconWrapper>
        </CloseArea>
      </Header>
      <Content>
        <Observer>
          {() => (
            <StyledTabs
              className="default"
              activeKey={store.tabKey}
              onChange={handleTabChange}
            >
              <TabPane key="common" tab={t('CM_ROOM_SETTING_BAISC_01')}>
                <CommonSettingPage roomInfo={roomInfo} />
              </TabPane>

              {/* AlarmBadge 추가 시 알림 뱃지 노출 */}
              <TabPane
                key="member"
                tab={
                  <>
                    {t('CM_MEMBER_MANAGEMENT')}
                    {/* <AlarmBadge /> */}
                  </>
                }
              >
                <MemberSettingPage roomInfo={roomInfo} />
              </TabPane>
            </StyledTabs>
          )}
        </Observer>
      </Content>
    </Wrapper>
  ) : null;
};

export default RoomSetting;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const CloseArea = styled.div`
  padding-left: 0.7rem;
  border-left: 1px solid ${props => props.theme.LineSub};
`;

const Centered = styled.div`
  display: flex;
  align-items: center;
`;

const Header = styled.div`
  display: flex;
  flex-shrink: 0;
  height: 2.63rem;
  padding: 0 0.89rem;
  align-items: center;
  justify-content: space-between;
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.25rem;
  padding: 0.25rem;
  cursor: pointer;
  &:hover {
    background: ${props => props.theme.StateLight};
  }
`;

const TitleText = styled.span`
  margin-left: 0.5rem;
  font-size: 0.88rem;
  font-weight: bold;
  color: ${props => props.theme.TextMain};
`;

const Content = styled.div`
  display: flex;
  overflow-y: auto;
  height: 100%;
`;

const StyledTabs = styled(Tabs)`
  width: 100%;

  .ant-tabs-content-holder {
    height: 100%;
  }

  .ant-tabs.default {
    .ant-tabs-nav {
      height: 2.88rem;
      margin-bottom: 0;
    }
  }

  .ant-tabs-tab {
    flex: none !important;
    width: 7rem;
  }

  .ant-tabs-tab-btn {
    position: relative;
  }

  .ant-tabs-nav {
    margin: 0;
  }

  .ant-tabs-content {
    overflow-y: auto;
  }
`;

const AlarmBadge = styled.span`
  position: absolute;
  top: -1px;
  right: -0.5rem;
  width: 0.375rem;
  height: 0.375rem;
  border-radius: 50%;
  background-color: #dc4547;
`;
