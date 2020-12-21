import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { Tabs, Button } from 'antd';
import { ArrowLeftIcon, CancelIcon } from '../Icons';
import Input from '../Input';

const { TabPane } = Tabs;

const MemberSettingPage = () => {
  return (
    <Wrapper style={{ padding: '2.56rem 3.75rem' }}>
      [TODO] : Room Member Setting
    </Wrapper>
  );
};

const CommonSettingPage = ({ roomInfo = null }) => {
  const [value, setValue] = useState('');
  const [isChanged, setIsChanged] = useState(false);
  const [isPrivateRoom, setIsPrivateRoom] = useState(false);

  useEffect(() => {
    const name = roomInfo?.customName || roomInfo?.name;
    setValue(name.substring(0, 20) || '');
  }, [roomInfo]);

  useEffect(() => {
    setIsPrivateRoom(true);
  }, [roomInfo]);

  const handleSave = () => {
    console.log('handleSave : ', roomInfo.id);
  };

  const handleUpdate = () => {
    console.log('handleUpdate : ', roomInfo.id);
  };

  const handleDelete = () => {
    console.log('handleDelete : ', roomInfo.id);
  };

  const handleChange = text => {
    setValue(text);
    setIsChanged(true);
  };

  return (
    <Wrapper style={{ padding: '2.56rem 3.75rem' }}>
      <SettingWrapper>
        <SettingTitleText style={{ marginBottom: '0.31rem' }}>
          Room 이름
        </SettingTitleText>
        <SettingDescriptionText style={{ marginBottom: '0.81rem' }}>
          구성원이 따로 이름 변경하여 보는 룸 이름에는 영향을 주지 않습니다.
        </SettingDescriptionText>
        <Input maxLength={20} value={value} onChange={handleChange} />
        <StyledButton
          type="solid"
          shape="round"
          disabled={!value.length || !isChanged}
          style={{ marginTop: '0.63rem' }}
          onClick={handleSave}
        >
          저장
        </StyledButton>
      </SettingWrapper>

      <SettingWrapper>
        {isPrivateRoom ? (
          <SettingTitleText style={{ color: '#777' }}>
            프라이빗 룸으로 전환됨
            <SettingDescriptionText style={{ marginLeft: '0.5rem' }}>
              2020.10.22 오후 5:42
            </SettingDescriptionText>
          </SettingTitleText>
        ) : (
          <SettingTitleText>프라이빗 룸으로 전환</SettingTitleText>
        )}
        <SettingDescriptionText style={{ marginBottom: '0.81rem' }}>
          프라이빗 룸으로 전활할 경우, 다시 오픈 룸으로 전환할 수 없습니다.
        </SettingDescriptionText>
        {!isPrivateRoom && (
          <StyledButton
            type="solid"
            shape="round"
            style={{ marginTop: '0.81rem' }}
            onClick={handleUpdate}
          >
            전환
          </StyledButton>
        )}
      </SettingWrapper>

      <SettingWrapper>
        <SettingTitleText>룸 삭제하기</SettingTitleText>
        <SettingDescriptionText style={{ marginBottom: '0.81rem' }}>
          삭제할 경우, 대화 내용과 데이터가 모두 삭제되며 룸 목록에서도
          삭제됩니다.
        </SettingDescriptionText>
        <StyledButton
          type="outlined"
          shape="round"
          style={{ marginTop: '0.81rem' }}
          onClick={handleDelete}
        >
          삭제
        </StyledButton>
      </SettingWrapper>
    </Wrapper>
  );
};

const RoomSetting = ({ roomInfo }) => {
  const history = useHistory();

  const handleBack = () => {
    history.goBack();
  };

  const handleClose = () => {
    history.push(`/s/${roomInfo.id}/talk`);
  };

  return (
    <Wrapper>
      <Header style={{ padding: '0 0.89rem' }}>
        <Centered>
          <IconWrapper onClick={handleBack}>
            <ArrowLeftIcon width={1} height={1} color="#75757F" />
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
          {/* TODO */}
          {/* <TabPane key="member" tab="구성원 관리">
            <MemberSettingPage />
          </TabPane> */}
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

const SettingWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 2.25rem;
`;

const Centered = styled.div`
  display: flex;
  align-items: center;
`;

const Header = styled.div`
  display: flex;
  height: 2.63rem;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #f0f2f5;
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  padding: 0.3rem;
  cursor: pointer;
  &:hover {
    background: #dcddff;
  }
`;

const TitleText = styled.span`
  color: #000;
  font-size: 0.88rem;
  font-weight: bold;
`;

const SettingTitleText = styled.span`
  font-size: 0.81rem;
  color: #000;
  font-weight: bold;
  margin-bottom: 0.31rem;
`;

const SettingDescriptionText = styled.span`
  font-size: 0.75rem;
  color: #777;
  font-weight: 300;
`;

const Content = styled.div`
  display: flex;
`;

const StyledTabs = styled(Tabs)`
  width: 100%;

  & .ant-tabs-tab {
    flex: none !important;
    width: 7rem;
  }

  & .ant-tabs-nav {
    height: 2.88rem;
  }
`;

const StyledButton = styled(Button)`
  align-self: flex-end;
  width: 4.38rem;
  height: 1.88rem;
  & span {
    font-size: 0.75rem;
  }
`;
