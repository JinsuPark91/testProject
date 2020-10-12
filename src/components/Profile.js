import React, { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import {
  ContainerOutlined,
  MobileOutlined,
  PhoneOutlined,
  MailOutlined,
  MessageOutlined,
  EditOutlined,
  CameraOutlined,
  PictureOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import { Button, Input, Dropdown, Menu, Upload } from 'antd';
import { useCoreStores } from 'teespace-core';
import { toJS } from 'mobx';

const Profile = ({ userId, editMode, isModal }) => {
  const { userStore, authStore } = useCoreStores();
  const [isEditMode, setEditMode] = useState(editMode);
  const [phone, setPhone] = useState('112');
  const [mobile, setMobile] = useState('010-1111-2222');

  const isMyId = () => userId === authStore.myInfo.id;

  useEffect(() => {
    if (!isMyId())
      (async () => {
        const myUserId = authStore.myInfo.id;
        const profile = await userStore.getProfile({ userId, myUserId });
        console.log('Profile : ', toJS(profile));
      })();
    else console.log('Profile : ', authStore.myInfo);
  });

  const handleChangeMode = () => {
    setEditMode(true);
  };

  const handleMeetingClick = () => {
    console.log('1 : 1 미팅');
  };

  const handleChangeBackground = () => {
    console.log('Change Background !!');
  };

  const handleChangeDefaultBackground = () => {
    console.log('Change default Background !!');
  };

  const handleChangePhoto = () => {
    console.log('Change Photo !!');
  };

  const handleChangeDefaultPhoto = () => {
    console.log('change default Photo !!');
  };

  const handleConfirm = () => {
    setEditMode(false);
  };

  const handleCancel = () => {
    setEditMode(false);
  };

  return (
    <Wrapper
      imageSrc="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQ0zLGlXZ_vEvQm4RplPIdsjgKSho4EyapEbw&usqp=CAU"
      isModal={isModal}
    >
      <Sidebar isModal={isModal}>
        <StyledButton isModal={isModal}>
          <MessageOutlined style={{ fontSize: '30px' }} />
          <Text>{isMyId() ? `나와의 Talk` : `1:1 Talk`}</Text>
        </StyledButton>
        {isMyId() ? (
          <StyledButton onClick={handleChangeMode} isModal={isModal}>
            <EditOutlined style={{ fontSize: '30px' }} />
            <Text>프로필 편집</Text>
          </StyledButton>
        ) : (
          <StyledButton onClick={handleMeetingClick} isModal={isModal}>
            <VideoCameraOutlined style={{ fontSize: '30px' }} />
            <Text>1:1 Meeting</Text>
          </StyledButton>
        )}
      </Sidebar>

      <Content>
        {isEditMode && (
          <Dropdown
            trigger={['click']}
            overlay={
              <Menu>
                <Menu.Item onClick={handleChangeBackground}>
                  배경 변경
                </Menu.Item>
                <Menu.Item onClick={handleChangeDefaultBackground}>
                  기본 이미지로 변경
                </Menu.Item>
              </Menu>
            }
          >
            <ImageChangeButton position="tl">
              <PictureOutlined />
            </ImageChangeButton>
          </Dropdown>
        )}
        <UserImageWrapper position="br">
          <UserImage src="https://image.yes24.com/momo/TopCate2199/MidCate005/219846755.jpg" />
          {isEditMode && (
            <Dropdown
              trigger={['click']}
              overlay={
                <Menu>
                  <Menu.Item onClick={handleChangePhoto}>
                    프로필 사진 변경
                  </Menu.Item>
                  <Menu.Item onClick={handleChangeDefaultPhoto}>
                    기본 이미지로 변경
                  </Menu.Item>
                </Menu>
              }
            >
              <ImageChangeButton position="br">
                <CameraOutlined />
              </ImageChangeButton>
            </Dropdown>
          )}
        </UserImageWrapper>
        <BigText style={{ marginTop: '20px' }}>조득용</BigText>
        <Text>(deuckyoung_cho@tmax.teespace.net)</Text>
        <UserInfoList>
          <UserInfoItem>
            <ContainerOutlined style={{ marginRight: '20px' }} />
            TmaxGroup·AC2-3팀·팀원
          </UserInfoItem>
          <UserInfoItem>
            <MobileOutlined style={{ marginRight: '20px' }} />
            {isEditMode ? (
              <Input
                onChange={e => {
                  setMobile(e.target.value);
                }}
                value={mobile}
              />
            ) : (
              <Text>{mobile}</Text>
            )}
          </UserInfoItem>
          <UserInfoItem>
            <PhoneOutlined style={{ marginRight: '20px' }} />
            {isEditMode ? (
              <Input
                onChange={e => {
                  setPhone(e.target.value);
                }}
                value={phone}
              />
            ) : (
              <Text>{phone}</Text>
            )}
          </UserInfoItem>
          <UserInfoItem>
            <MailOutlined style={{ marginRight: '20px' }} />
            deuckyoung_cho@tmax.co.kr
          </UserInfoItem>
        </UserInfoList>
        <ButtonContainer>
          {isEditMode && (
            <>
              <Button style={{ marginRight: '20px' }} onClick={handleConfirm}>
                저장
              </Button>
              <Button onClick={handleCancel}>취소</Button>
            </>
          )}
        </ButtonContainer>
      </Content>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: ${props => (props.isModal ? 'column-reverse' : 'row')};
  width: 100%;
  height: 100%;
  background-image: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)),
    url('${props => props.imageSrc}');
  background-repeat: no-repeat;
  background-size: 100% 100%;
`;

const Sidebar = styled.div`
  display: flex;
  flex-direction: ${props => (props.isModal ? 'row' : 'column')};
  align-items: center;
  justify-content: center;
  width: ${props => (props.isModal ? '100%' : '250px')};
  height: ${props => (props.isModal ? '200px' : '100%')};
  background: rgba(0, 0, 0, 0.3);
`;

const Text = styled.span`
  display: flex;
  align-items: center;
  color: white;
  font-size: 20px;
  font-weight: 600;
`;

const ImageChangeButton = styled(Text)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  background: black;
  border-radius: 50%;
  position: absolute;

  &:hover {
    background: rgba(90, 95, 255);
    cursor: pointer;
  }

  ${props => {
    switch (props.position) {
      case 'tl':
      default:
        return css`
          top: 10px;
          left: 10px;
        `;

      case 'tr':
        return css`
          top: 10px;
          right: 10px;
        `;
      case 'bl':
        return css`
          bottom: 10px;
          left: 10px;
        `;
      case 'br':
        return css`
          bottom: 10px;
          right: 10px;
        `;
    }
  }}
`;

const StyledButton = styled(Text)`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  width: 200px;
  height: ${props => (props.isModal ? '100px' : '200px')};
  margin-top: 20px;
  border-radius: 10px;

  &:hover {
    background: rgba(255, 255, 255, 0.5);
    cursor: pointer;
  }
`;

const Content = styled.div`
  display: flex;
  position: relative;
  width: calc(100% - 250px);
  height: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
const UserImageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  align-items: center;
  justify-content: center;
  width: 210px;
  height: 210px;
  background: white;
  border-radius: 50%;
`;
const UserImage = styled.img`
  width: 200px;
  height: 200px;
  border-radius: 50%;
`;

const UserInfoList = styled.div`
  display: flex;
  flex-direction: column;
`;

const UserInfoItem = styled.div`
  display: flex;
  align-items: center;
  color: white;
  font-size: 20px;
  font-weight: 600;
  margin-top: 20px;
  height: 30px;
`;
const BigText = styled(Text)`
  font-size: 30px;
`;

const ButtonContainer = styled.div`
  height: 50px;
  margin-top: 20px;
  display: flex;
`;

export default Profile;
