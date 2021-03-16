import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Dropdown, Menu } from 'antd';
import { observer } from 'mobx-react';
import { useCoreStores } from 'teespace-core';
import { LockLineIcon, CameraIcon } from '../Icons';
import { CloseIcon, SettingIcon } from './Icon';
import {
  handleProfileMenuClick,
  toBase64,
  toBlob,
  getCompanyNumber,
  getMobileNumber,
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

const MobileProfile = observer(
  ({
    userId = null,
    editOnlyMode = false,
    onModeChange = null,
    onClickSaveBtn = () => {},
    onClickCancelBtn = () => {},
  }) => {
    const history = useHistory();
    const { userStore, authStore } = useCoreStores();
    const [isEditMode, setEditMode] = useState(editOnlyMode);
    const [cancelDialogVisible, setCancelDialogVisible] = useState(false);
    const [toastText, setToastText] = useState('');
    const [isToastVisible, setIsToastVisible] = useState(false);
    const [isChange, setIsChange] = useState(false);
    const [userType, setUserType] = useState('');

    // NOTE. Setting state to undefined means the state is not changed
    //  This undefined is different from empty('')
    const [name, setName] = useState(undefined);
    const [statusMsg, setStatusMsg] = useState(undefined);
    const [phone, setPhone] = useState(undefined);
    const [mobile, setMobile] = useState(undefined);
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
      setName(profile?.displayName);
      setStatusMsg(profile?.profileStatusMsg);
      setPhone(profile?.companyNum);
      setMobile(profile?.phone);
      setLocalProfilePhoto(undefined);
      setLocalBackgroundPhoto(undefined);
    };

    const resetLocalInputData = () => {
      setName(undefined);
      setStatusMsg(undefined);
      setPhone(undefined);
      setMobile(undefined);
      setLocalProfilePhoto(undefined);
      setLocalBackgroundPhoto(undefined);
    };

    useEffect(() => {
      if (isEditMode) {
        setLocalProfilePhoto(undefined);
        setLocalBackgroundPhoto(undefined);
      }
      setEditMode(editOnlyMode);
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

    useEffect(() => {
      if (onModeChange && typeof onModeChange === 'function')
        onModeChange(isEditMode);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isEditMode]);

    const handleMoveTalk = roomInfo => {
      history.push(`/talk/${roomInfo.id}`);
    };

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
      // set update data from user input
      const updatedInfo = {};
      if (name || name === '') updatedInfo.nick = name;
      if (phone || phone === '') updatedInfo.companyNum = phone;
      if (mobile || mobile === '') updatedInfo.phone = mobile;
      if (statusMsg || statusMsg === '')
        updatedInfo.profileStatusMsg = statusMsg;

      if (localProfilePhoto?.includes('blob:')) {
        const blobImage = await toBlob(localProfilePhoto);
        const base64Image = await toBase64(blobImage);
        updatedInfo.profilePhoto = base64Image;
        URL.revokeObjectURL(localProfilePhoto);
      } else {
        // The null value means default photo
        updatedInfo.profilePhoto =
          localProfilePhoto === null ? localProfilePhoto : getProfilePhoto();
      }

      if (localBackgroundPhoto?.includes('blob:')) {
        const blobImage = await toBlob(localBackgroundPhoto);
        const base64Image = await toBase64(blobImage);
        updatedInfo.backPhoto = base64Image;
        URL.revokeObjectURL(localBackgroundPhoto);
      } else {
        // The null value means default photo
        updatedInfo.backPhoto =
          localBackgroundPhoto === null ? localBackgroundPhoto : getBackPhoto();
      }
      await userStore.updateMyProfile({ updatedInfo });

      resetLocalInputData();
      setIsChange(false);
      setEditMode(false);
      onClickSaveBtn();
    };

    const handleExit = () => {
      setIsChange(false);
      setEditMode(false);
      resetLocalInputData();
      setCancelDialogVisible(false);
      onClickCancelBtn();
    };

    const handleExitCancel = () => {
      setCancelDialogVisible(false);
    };

    const handleCancel = () => {
      if (isChange) {
        setCancelDialogVisible(true);
      } else {
        handleExit();
      }
    };

    // FIXME: 추후 Talk에서의 프로필 고려 필요
    const handleMoveFriend = () => {
      history.push(`/friend/${userStore.myProfile.id}`);
    };

    // check edit mode
    const editEnabled = editOnlyMode || isEditMode;

    return (
      <Wrapper>
        <Container imageSrc={renderBackgroundPhoto}>
          {editEnabled ? (
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
            {editEnabled && (
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
                    <CameraIcon width="1.25" height="1.25" />
                  </ImageChangeButton>
                </Dropdown>
              </ContentTop>
            )}
            <ContentBody>
              <UserImageWrapper position="br">
                <UserImage src={renderProfilePhoto} />
                {isMyId() && editEnabled && (
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
                        <CameraIcon width="1.88" height="1.88" />
                      </CameraBox>
                    </Dropdown>
                  </ImageChange>
                )}
              </UserImageWrapper>
              <BigText>
                {editEnabled ? (
                  <EditNameInput
                    maxLength={20}
                    placeholder={profile?.displayName}
                    onChange={e => {
                      setIsChange(true);
                      setName(e);
                    }}
                    value={name !== undefined ? name : profile?.displayName}
                  />
                ) : (
                  profile?.displayName
                )}
              </BigText>
              {!editEnabled && (
                <UserEmailText>{`(${profile?.loginId})`}</UserEmailText>
              )}
              <UserInfoList>
                {userType === 'USR0001' && (
                  <UserInfoItem style={{ alignItems: 'flex-start' }}>
                    <StyleOfficeIcon iconimg="address" />
                    <UserInfoText>
                      <span style={{ whiteSpace: 'break-spaces' }}>
                        {profile?.getFullCompanyJob()}
                      </span>
                      {editEnabled && (
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
                    {editEnabled ? (
                      <StyleInput
                        onChange={e => {
                          setIsChange(true);
                          setPhone(e.target.value);
                        }}
                        value={
                          phone !== undefined
                            ? phone
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
                  {editEnabled ? (
                    <StyleInput
                      onChange={e => {
                        setIsChange(true);
                        setMobile(e.target.value);
                      }}
                      value={
                        mobile !== undefined ? mobile : profile?.phone || ``
                      }
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
  },
);

export default MobileProfile;
