import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { Tabs, Button } from 'antd';
import { useCoreStores, Toast } from 'teespace-core';
import { DateTime } from 'luxon';
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
  const [isToastVisible, setIsToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const { roomStore, userStore } = useCoreStores();
  const history = useHistory();
  const myUserId = userStore.myProfile.id;

  useEffect(() => {
    if (roomInfo) {
      const name = roomInfo?.customName || roomInfo?.name;
      setValue(name.substring(0, 20) || '');

      const isPrivate = roomInfo.type === 'WKS0002';
      setIsPrivateRoom(isPrivate);
    }
  }, [roomInfo]);

  const getConvertedTime = timestamp => {
    if (timestamp) {
      return DateTime.fromFormat(timestamp, 'yyyy-MM-dd HH:mm:ss.S z')
        .toFormat('yyyy.MM.dd a hh:mm')
        .replace('AM', '오전')
        .replace('PM', '오후');
    }
    return '';
  };

  const handleSave = async () => {
    try {
      const result = await roomStore.updateRoomInfo({
        roomId: roomInfo.id,
        newName: value,
      });

      if (result) {
        setIsChanged(false);
        // NOTE : roomInfo.adminName 에 값이 없음.
        const admin = await userStore.getProfile({ userId: roomInfo.adminId });
        setToastMessage(
          `${admin.nick || admin.name} 님이 룸 이름을 변경했습니다.`,
        );
        setIsToastVisible(true);
      } else throw Error(`result:${result}`);
    } catch (err) {
      console.error(`[Platform] 룸 이름 변경 실패, ${err}`);
    }
  };

  const handleModeUpdate = async () => {
    try {
      const result = await roomStore.changeRoomModePrivate({
        roomId: roomInfo.id,
        userId: myUserId,
      });

      if (result) setIsPrivateRoom(true);
      else throw Error(`result:${result}`);
    } catch (err) {
      console.error(`[Platform] 프라이빗 룸 전환 실패, ${err}`);
    }
  };

  const handleDelete = async () => {
    try {
      const result = await roomStore.deleteRoom({
        userId: myUserId,
        roomId: roomInfo.id,
      });
      const myRoomId =
        roomStore.getDMRoom({ myUserId, userId: myUserId })?.roomInfo?.id ||
        roomStore.getRoomArray()?.[0].id;

      if (result) history.push(`/s/${myRoomId}/talk`);
      else throw Error(`result:${result}`);
    } catch (err) {
      console.error(`[Platform] 룸 삭제 실패, ${err}`);
    }
  };

  const handleChange = text => {
    setValue(text);
    setIsChanged(true);
  };

  const handleToastClose = () => {
    setIsToastVisible(false);
  };

  return (
    <Wrapper style={{ padding: '2.56rem 3.75rem' }}>
      <Toast
        visible={isToastVisible}
        timeoutMs={1000}
        onClose={handleToastClose}
      >
        {toastMessage}
      </Toast>
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
              {getConvertedTime(roomInfo?.typeModifiedDate)}
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
            onClick={handleModeUpdate}
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
