import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { Observer } from 'mobx-react';
import { Tabs } from 'antd';
import { useTranslation } from 'react-i18next';
import { ArrowLeftIcon, CancelIcon } from '../Icons';
import { useStores } from '../../stores';
import MemberSettingPage from './MemberSettingPage';
import CommonSettingPage from './CommonSettingPage';

const { TabPane } = Tabs;

const RoomSetting = ({ roomId }) => {
  const { roomSettingStore: store } = useStores();
  const { t } = useTranslation();
  const history = useHistory();

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

  return (
    <Wrapper>
      <Header style={{ padding: '0 0.89rem' }}>
        <Centered>
          <IconWrapper onClick={handleClose}>
            <ArrowLeftIcon width={1} height={1} color="#000000" />
          </IconWrapper>
          <TitleText style={{ marginLeft: '0.5rem' }}>
            {t('CM_ROOM_SETTING')}
          </TitleText>
        </Centered>
        <Centered
          style={{ borderLeft: '1px solid #E3E7EB', paddingLeft: '0.7rem' }}
        >
          <IconWrapper onClick={handleClose}>
            <CancelIcon width={1} height={1} color="#75757F" />
          </IconWrapper>
        </Centered>
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
                <CommonSettingPage roomId={roomId} />
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
                <MemberSettingPage roomId={roomId} />
              </TabPane>
            </StyledTabs>
          )}
        </Observer>
      </Content>
    </Wrapper>
  );
};

export default RoomSetting;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const Centered = styled.div`
  display: flex;
  align-items: center;
`;

const Header = styled.div`
  display: flex;
  flex-shrink: 0;
  height: 2.63rem;
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
    background: #eae6e0;
  }
`;

const TitleText = styled.span`
  color: #000;
  font-size: 0.88rem;
  font-weight: bold;
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
