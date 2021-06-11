import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Dropdown, Menu } from 'antd';
import { observer } from 'mobx-react';
import { useCoreStores } from 'teespace-core';
import { useStores } from '../../stores';
import { LockLineIcon, CameraIcon, ImageIcon } from '../Icons';
import { CloseIcon } from './Icon';
import {
  handleProfileMenuClick,
  getCompanyNumber,
  getMobileNumber,
  updateMyProfile,
} from '../../utils/ProfileUtil';
import {
  Wrapper,
  TextHeader,
  Header,
  Sidebar,
  StyledUpload,
  Text,
  UserEmailText,
  EditTitle,
  ButtonBox,
  IconButton,
  ImageChangeButton,
  StyledButton,
  Container,
  Content,
  ContentTop,
  ContentBody,
  UserImageWrapper,
  UserImage,
  UserInfoList,
  UserInfoItem,
  BigText,
  FriendsIcon,
  StyleIcon,
  UserInfoText,
  StyleOfficeIcon,
  EditNameInput,
  StyleInput,
  LockIconBox,
  ImageChange,
  TextButton,
  CameraBox,
} from './MobileProfileStyle';

const MobileProfile = observer(({ userId = null }) => {
  const history = useHistory();
  const { uiStore } = useStores();
  const { userStore, authStore } = useCoreStores();
  const [isEditMode, setEditMode] = useState(false);
  const [isChange, setIsChange] = useState(false);
  const [userType, setUserType] = useState('');

  // NOTE. Setting state to undefined means the state is not changed
  //  This undefined is different from empty('')
  const [nick, setNick] = useState(undefined);
  const [companyNum, setCompanyNum] = useState(undefined);
  const [phone, setPhone] = useState(undefined);
  // NOTE. Setting null to photo means default image is used
  const [localBackgroundPhoto, setLocalBackgroundPhoto] = useState(undefined);
  const [localProfilePhoto, setLocalProfilePhoto] = useState(undefined);

  const isMyId = () => userId === userStore.myProfile.id;
  const profile = isMyId()
    ? userStore.myProfile
    : userStore.userProfiles[userId];
  const getBackPhoto = () => {
    return userStore.getBackgroundPhotoURL(userId);
  };
  const getProfilePhoto = () => {
    return userStore.getProfilePhotoURL(userId, 'medium');
  };

  // calculate photo
  const renderProfilePhoto =
    localProfilePhoto === null
      ? profile.defaultPhotoUrl
      : localProfilePhoto || getProfilePhoto();
  const renderBackgroundPhoto =
    localBackgroundPhoto === null
      ? profile.defaultBackgroundUrl
      : localBackgroundPhoto || getBackPhoto();

  // calculate whether default url be shown
  const isDefaultProfilePhotoUsed =
    localProfilePhoto === null ||
    (localProfilePhoto === undefined && !profile?.thumbPhoto);
  const isDefaultBackgroundPhotoUsed =
    localBackgroundPhoto === null ||
    (localBackgroundPhoto === undefined && !profile?.thumbBack);

  const setLocalInputData = () => {
    setNick(profile?.displayName);
    setCompanyNum(profile?.companyNum);
    setPhone(profile?.phone);
    setLocalProfilePhoto(undefined);
    setLocalBackgroundPhoto(undefined);
  };

  const resetLocalInputData = () => {
    setNick(undefined);
    setCompanyNum(undefined);
    setPhone(undefined);
    setLocalProfilePhoto(undefined);
    setLocalBackgroundPhoto(undefined);
  };

  useEffect(() => {
    (async () => {
      const userProfile = userStore.userProfiles[userId];
      if (!userProfile) {
        await userStore.getProfile({ userId });
      }

      const userAuthInfo = authStore.user;
      setUserType(userAuthInfo.type);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const handleMoveTalk = roomInfo => history.push(`/talk/${roomInfo.id}`);

  const handleTalkClick = async () => {
    const myUserId = userStore.myProfile.id;
    handleProfileMenuClick(
      myUserId,
      userId,
      handleMoveTalk,
      handleMoveTalk,
      handleMoveTalk,
    );
  };

  const handleChangetoEditMode = () => {
    setEditMode(true);
    setLocalInputData();
  };

  const handleChangeBackground = file => {
    setIsChange(true);
    setLocalBackgroundPhoto(URL.createObjectURL(file));
  };
  const handleChangeDefaultBackground = () => {
    setIsChange(true);
    setLocalBackgroundPhoto(null);
  };

  const handleChangePhoto = file => {
    setIsChange(true);
    setLocalProfilePhoto(URL.createObjectURL(file));
  };
  const handleChangeDefaultPhoto = () => {
    setIsChange(true);
    setLocalProfilePhoto(null);
  };

  const handleConfirm = async () => {
    await updateMyProfile({
      nick,
      companyNum,
      phone,
    });

    resetLocalInputData();
    setIsChange(false);
    setEditMode(false);
  };

  const handleExit = () => {
    setIsChange(false);
    setEditMode(false);
    resetLocalInputData();
  };

  // 추후 Talk에서의 프로필 고려 필요
  const handleMoveFriend = () =>
    history.push(`/friend/${userStore.myProfile.id}`);

  const handleImageClick = () => {
    if (!isEditMode) history.push(`/image/${userId}`);
  };

  return (
    <Wrapper>
      <Container imageSrc={renderBackgroundPhoto} isEditMode={isEditMode}>
        {isEditMode ? (
          <>
            <TextHeader>
              <ButtonBox onClick={handleExit}>
                <IconButton type="ghost" icon={<CloseIcon color="#fff" />} />
              </ButtonBox>
              <EditTitle>프로필 편집</EditTitle>
              <ButtonBox>
                <TextButton onClick={handleConfirm} type="ghost">
                  저장
                </TextButton>
              </ButtonBox>
            </TextHeader>
          </>
        ) : (
          <>
            <Header>
              <ButtonBox onClick={handleMoveFriend}>
                <IconButton type="ghost" icon={<CloseIcon color="#fff" />} />
              </ButtonBox>
              {/* <ButtonBox>
                <IconButton type="ghost" icon={<SettingIcon />} />
              </ButtonBox> */}
            </Header>
          </>
        )}
        <Content>
          {/* {isEditMode && (
            <ContentTop>
              <Dropdown
                trigger={['click']}
                overlay={
                  <Menu>
                    <Menu.Item>
                      <StyledUpload
                        component="div"
                        accept={['.jpg,.jpeg,.png']}
                        multiple={false}
                        customRequest={({ file }) =>
                          handleChangeBackground(file)
                        }
                      >
                        내 PC에서 배경 변경
                      </StyledUpload>
                    </Menu.Item>
                    <Menu.Item
                      disabled={isDefaultBackgroundPhotoUsed}
                      onClick={handleChangeDefaultBackground}
                    >
                      기본 이미지로 변경
                    </Menu.Item>
                  </Menu>
                }
              >
                <ImageChangeButton>
                  <ImageIcon width="1.25" height="1.25" />
                </ImageChangeButton>
              </Dropdown>
            </ContentTop>}
          )} */}
          <ContentBody>
            <UserImageWrapper position="br" onClick={handleImageClick}>
              <UserImage src={renderProfilePhoto} />
              {/* {isMyId() && isEditMode && (
                <ImageChange>
                  <Dropdown
                    trigger={['click']}
                    overlay={
                      <Menu>
                        <Menu.Item>
                          <StyledUpload
                            component="div"
                            multiple={false}
                            accept={['.jpg,.jpeg,.png']}
                            customRequest={({ file }) =>
                              handleChangePhoto(file)
                            }
                          >
                            프로필 사진 변경
                          </StyledUpload>
                        </Menu.Item>
                        <Menu.Item
                          disabled={isDefaultProfilePhotoUsed}
                          onClick={handleChangeDefaultPhoto}
                        >
                          기본 이미지로 변경
                        </Menu.Item>
                      </Menu>
                    }
                  >
                    <CameraBox>
                      <CameraIcon width="1.88" height="1.88" color="#fff" />
                    </CameraBox>
                  </Dropdown>
                </ImageChange>
              )} */}
            </UserImageWrapper>
            <BigText>
              {isEditMode ? (
                <EditNameInput
                  maxLength={20}
                  placeholder={profile?.displayName}
                  onChange={e => {
                    setIsChange(true);
                    setNick(e);
                  }}
                  value={nick !== undefined ? nick : profile?.displayName}
                />
              ) : (
                profile?.displayName
              )}
            </BigText>
            {!isEditMode && (
              <UserEmailText>{`(${profile?.loginId})`}</UserEmailText>
            )}
            <UserInfoList>
              {userType === 'USR0001' && (
                <UserInfoItem style={{ alignItems: 'flex-start' }}>
                  <StyleOfficeIcon iconimg="address" />
                  <UserInfoText>
                    <span>{profile?.getFullCompanyJob() || '-'}</span>
                    {isEditMode && (
                      <LockIconBox>
                        <LockLineIcon width="0.88" height="0.88" />
                      </LockIconBox>
                    )}
                  </UserInfoText>
                </UserInfoItem>
              )}
              {userType === 'USR0001' && (
                <UserInfoItem>
                  <StyleOfficeIcon iconimg="company" />
                  {isEditMode ? (
                    <StyleInput
                      onChange={e => {
                        setIsChange(true);
                        setCompanyNum(e.target.value);
                      }}
                      value={
                        companyNum !== undefined
                          ? companyNum
                          : profile?.companyNum || ``
                      }
                      placeholder="회사 전화를 입력하세요."
                    />
                  ) : (
                    <UserInfoText>
                      <span>{getCompanyNumber(profile)}</span>
                    </UserInfoText>
                  )}
                </UserInfoItem>
              )}
              <UserInfoItem>
                <StyleOfficeIcon iconimg="phone" />
                {isEditMode ? (
                  <StyleInput
                    onChange={e => {
                      setIsChange(true);
                      setPhone(e.target.value);
                    }}
                    value={phone !== undefined ? phone : profile?.phone || ``}
                    placeholder="휴대폰 번호를 입력하세요."
                  />
                ) : (
                  <UserInfoText>
                    <span>{getMobileNumber(profile)}</span>
                  </UserInfoText>
                )}
              </UserInfoItem>
            </UserInfoList>
          </ContentBody>
        </Content>
      </Container>
      {!isEditMode && (
        <Sidebar>
          <StyledButton onClick={handleTalkClick}>
            <FriendsIcon />
            <Text>{isMyId() ? '나와의 Talk' : '1:1 Talk'}</Text>
          </StyledButton>
          {isMyId() && (
            <StyledButton onClick={handleChangetoEditMode}>
              <StyleIcon iconimg="profile" />
              <Text>프로필 편집</Text>
            </StyledButton>
          )}
        </Sidebar>
      )}
    </Wrapper>
  );
});

export default MobileProfile;
