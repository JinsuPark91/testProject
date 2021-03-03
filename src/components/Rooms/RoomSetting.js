import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { Tabs } from 'antd';
import { useCoreStores } from 'teespace-core';
import { useTranslation } from 'react-i18next';
import { ArrowLeftIcon, CancelIcon } from '../Icons';
import MemberSettingPage from './MemberSettingPage';
import CommonSettingPage from './CommonSettingPage';

const { TabPane } = Tabs;

const RoomSetting = ({ roomInfo = null }) => {
  const { t } = useTranslation();
  const history = useHistory();
  const { userStore, roomStore } = useCoreStores();
  const [members, setMembers] = useState([]);

  const handleClose = () => {
    history.push(`/s/${roomInfo.id}/talk`);
  };

  useEffect(() => {
    if (roomInfo) {
      const myUserId = userStore.myProfile.id;
      const roomId = roomInfo.id;

      roomStore
        .fetchRoomMemberList({
          myUserId,
          roomId,
        })
        .then(res => setMembers(res));
    }
  }, [roomInfo]);

  return (
    <Wrapper>
      <Header style={{ padding: '0 0.89rem' }}>
        <Centered>
          <IconWrapper onClick={handleClose}>
            <ArrowLeftIcon width={1} height={1} color="#000000" />
          </IconWrapper>
          <TitleText style={{ marginLeft: '0.5rem' }}>
            {t('WEB_COMMON_ROOM_CONTEXT_MENU_02')}
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
        <StyledTabs className="default">
          <TabPane key="common" tab={t('WEB_COMMON_ROOM_SETTING_BASIC_01')}>
            <CommonSettingPage roomInfo={roomInfo} />
          </TabPane>

          <TabPane key="member" tab={t('TEMP_04')}>
            <MemberSettingPage members={members} roomId={roomInfo?.id} />
          </TabPane>
        </StyledTabs>
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

  & .ant-tabs-content-holder {
    height: 100%;
  }

  & .ant-tabs.default {
    .ant-tabs-nav {
      height: 2.88rem;
      margin-bottom: 0;
    }
  }

  & .ant-tabs-tab {
    flex: none !important;
    width: 7rem;
  }

  & .ant-tabs-content {
    overflow-y: auto;
  }
`;
