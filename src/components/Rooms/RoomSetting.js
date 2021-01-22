import React from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { Tabs } from 'antd';
import { ArrowLeftIcon, CancelIcon } from '../Icons';
import MemberSettingPage from './MemberSettingPage';
import CommonSettingPage from './CommonSettingPage';

const { TabPane } = Tabs;

const RoomSetting = ({ roomInfo }) => {
  const history = useHistory();

  const handleClose = () => {
    history.push(`/s/${roomInfo.id}/talk`);
  };

  return (
    <Wrapper>
      <Header style={{ padding: '0 0.89rem' }}>
        <Centered>
          <IconWrapper onClick={handleClose}>
            <ArrowLeftIcon width={1} height={1} color="#000000" />
          </IconWrapper>
          <TitleText style={{ marginLeft: '0.5rem' }}>룸 설정</TitleText>
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
          <TabPane key="common" tab="기본 정보 설정">
            <CommonSettingPage roomInfo={roomInfo} />
          </TabPane>

          <TabPane key="member" tab="구성원 관리">
            <MemberSettingPage />
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
