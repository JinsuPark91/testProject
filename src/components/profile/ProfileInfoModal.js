import React, { useEffect, useState, useCallback } from 'react';
import styled from 'styled-components';
import { Button, Modal } from 'antd';
import { useCoreStores } from 'teespace-core';
import { useHistory } from 'react-router-dom';
import SettingDialog from '../usersettings/SettingDialog';
import { useStore } from '../../stores';
import { useProfileContext } from './ProfileContextProvider';

const ProfileInfoModal = ({ userId, thumbPhoto }) => {
  const { userStore, authStore } = useCoreStores();
  const { uiStore } = useStore();
  const history = useHistory();
  const [profile, setProfile] = useState(null);
  const [itemKey, setItemKey] = useState('2');
  const [settingDialogVisible, setSettingDialogVisible] = useState(false);
  const useProfile = useProfileContext();

  const handleSettingDialogOpen = useCallback(
    e => {
      setItemKey(e);
      useProfile.setState({ ...useProfile.state, infoMode: false });
      setSettingDialogVisible(true);
    },
    [uiStore],
  );

  const handleSettingDialogClose = useCallback(() => {
    setSettingDialogVisible(false);
  });

  const handleInfoClose = useCallback(
    e => {
      useProfile.setState({ ...useProfile.state, infoMode: false });
    },
    [useProfile],
  );

  const toggleEditMode = useCallback(
    e => {
      if (typeof e === 'boolean')
        useProfile.setState({ ...useProfile.state, infoMode: !e, editMode: e });
      else
        useProfile.setState({
          ...useProfile.state,
          infoMode: false,
          editMode: true,
        });
    },
    [useProfile],
  );

  const handleLogout = async () => {
    await authStore.logout({});
    history.push(`/login`);
  };

  const revokeURL = useCallback(() => {
    URL.revokeObjectURL(thumbPhoto);
  }, [thumbPhoto]);

  useEffect(() => {
    (async () => {
      const userProfile = await userStore.getProfile({ userId });
      setProfile(userProfile);
    })();
  }, [userStore]);
  return (
    <ProfilePopup
      visible={useProfile.state.infoMode}
      mask={false}
      maskClosable
      onCancel={handleInfoClose}
      title={null}
      closable={false}
      footer={null}
      transitionName=""
      maskTransitionName=""
      style={{ margin: '0px 0px 0px 0px', padding: '0px 0px 0px 0px' }}
    >
      <Wrapper>
        <ProfileWrapper>
          <UserImage src={thumbPhoto} onLoad={revokeURL} />
          <BigText style={{ marginTop: '20px' }}>{profile?.name}</BigText>
          <Text>{`(${profile?.email})`}</Text>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'row',
            }}
          >
            <TextButton onClick={toggleEditMode}>프로필 수정</TextButton>
            <div
              style={{
                display: 'inline-block',
                borderRight: '1px solid #cacdff',
                height: '0.81rem',
                verticalAlign: 'middle',
              }}
            />
            <TextButton onClick={handleSettingDialogOpen.bind(this, '6')}>
              비밀번호 변경
            </TextButton>
          </div>
          <LogOutButton onClick={handleLogout}>로그아웃</LogOutButton>
        </ProfileWrapper>
        <ProfileBottom>
          <ProfileSupportButton
            onClick={handleSettingDialogOpen.bind(this, '2')}
          >
            설정
          </ProfileSupportButton>
          <span>·</span>
          <ProfileSupportButton>고객지원</ProfileSupportButton>
        </ProfileBottom>
        <SettingDialog
          selectedKeyA={itemKey}
          visible={settingDialogVisible}
          onCancle={
            handleSettingDialogClose
          } /* 1-2팀 문의하여 워딩 수정 필요(cancle -> cancel) */
        />
      </Wrapper>
    </ProfilePopup>
  );
};
const ProfilePopup = styled(Modal)`
  position: absolute;
  height: auto;
  .ant-modal {
    width: 0px;
    margin: 0px 0px 0px 0px;
    padding: 0px 0px 0px 0px;
  }
  .ant-modal-content {
    height: 0px;
  }
  .ant-modal-body {
    padding: 0px;
  }
`;
const Wrapper = styled.div`
  display: flex;
  font-size: 140.556%;
  position: fixed;
  top: 2.69rem;
  right: 20px;
  background: #fff;
  height: ${props => (props.isEditMode ? '22.94rem' : 'auto')};
  max-height: 25.69rem;
  width: 17.06rem;
  flex-direction: column;
  border-radius: 4px;
  z-index: 1000;
  align-items: center;
  box-shadow: 0 5px 10px 0 rgba(0, 0, 0, 0.3);
`;
const Text = styled.span`
  width: 100%;
  display: inline-block;
  margin-top: 0.5rem;
  color: #ffffff;
  text-align: center;
  font-size: 0.69rem;
  opacity: 0.8;
`;
const ProfileBottom = styled.div`
  width: 100%;
  height: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  background: white;
  border-radius: 4px;
`;
const ProfileWrapper = styled.div`
  border-radius: 4px 4px 20px 20px;
  height: 15.69rem;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #cacdff;
  font-size: 0.75rem;
  background-size: cover !important;
  background-repeat: no-repeat;
  background: #0b1d41;
  z-index: 1;
`;
const LogOutButton = styled(Button)`
  width: 14rem;
  height: 1.88rem;
  border-radius: 30px;
  display: inline-block;
  text-align: center;
  color: #7b869a;
  border: 1px solid #7b869a;
  background: transparent;
  margin-top: 0.5rem;
  font-size: 0.75rem;
  cursor: pointer;
  &:hover {
    background: #7b869a 100%;
    border: 1px solid #7b869a;
    color: #ffffff;
  }
  &:focus {
    background: transparent;
    border: 1px solid #7b869a;
    color: #7b869a;
  }
  &:active {
    background: #6c56e5;
    border: 1px solid #6c56e5;
    color: #ffffff;
  }
`;
const ProfileSupportButton = styled(Button)`
  background-color: #ffffff;
  font-size: 0.75rem;
  border: 0px;
  border-radius: 30px;
  color: #3b3b3b;
  cursor: pointer;
  width: 30%;
  height: 1.69rem;
  display: inline-block;
  margin-top: 1rem;
  &:hover {
    color: #000000;
    background-color: #dcddff;
    border: 0px;
    font-size: 0.75rem;
    border-radius: 30px;
  }
  &:focus {
    background-color: #ffffff;
    color: #523dc7;
    font-size: 0.75rem;
    border-radius: 30px;
    border: 0px;
  }
  &:active {
    background-color: #ffffff;
    font-size: 0.75rem;
    border-radius: 30px;
    color: #523dc7;
  }
`;
const UserImage = styled.img`
  width: 5rem;
  height: 5rem;
  border-radius: 50%;
  margin: 1.44rem 0px 0px 0px;
`;
const BigText = styled(Text)`
  font-size: 30px;
`;
const TextButton = styled(Button)`
  display: inline-block;
  text-align: center;
  background: transparent;
  color: #cacdff;
  height: 0.81rem;
  font-size: 0.75rem;
  border: none;
  &:hover,
  &:focus,
  &:active {
    cursor: pointer;
    border: none;
    background: transparent;
    color: #cacdff;
  }
`;
export default ProfileInfoModal;
