import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Dropdown, Menu } from 'antd';
import { observer } from 'mobx-react';
import { useCoreStores, Message, Toast } from 'teespace-core';
import { useTranslation } from 'react-i18next';
import PlatformUIStore from '../../stores/PlatformUIStore';
import { getQueryParams, getQueryString } from '../../utils/UrlUtil';
import {
  handleProfileMenuClick,
  getCompanyNumber,
  getMobileNumber,
  getProfileEditDto,
} from '../../utils/ProfileUtil';
import {
  Wrapper,
  Sidebar,
  StyledUpload,
  Text,
  UserEmailText,
  ImageChangeButton,
  StyledButton,
  Content,
  ContentTop,
  ContentBody,
  UserImageWrapper,
  UserImage,
  UserInfoList,
  UserInfoItem,
  BigText,
  StatusText,
  ButtonContainer,
  StyleIcon,
  UserInfoText,
  StyleOfficeIcon,
  EditNameInput,
  StyleInput,
  BookMarkButton,
  Blind,
  LockIconBox,
  ImageChange,
  CameraBox,
  ButtonCancel,
} from '../../styles/profile/MainProfileStyle';
import {
  LockLineIcon,
  ChattingWithMeIcon,
  MeetingIcon,
  CameraIcon,
} from '../Icons';

const MainProfile = observer(({ userId = null }) => {
  const history = useHistory();
  const { t } = useTranslation();

  const { userStore, friendStore, authStore, roomStore } = useCoreStores();
  const [isEditMode, setEditMode] = useState(false);
  const [cancelDialogVisible, setCancelDialogVisible] = useState(false);
  const [toastText, setToastText] = useState('');
  const [isToastVisible, setIsToastVisible] = useState(false);
  const [isChange, setIsChange] = useState(false);
  const [userType, setUserType] = useState('');

  // NOTE. Setting state to undefined means the state is not changed
  //  This undefined is different from empty('')
  const [nick, setNick] = useState(undefined);
  const [statusMsg, setStatusMsg] = useState(undefined);
  const [companyNum, setCompanyNum] = useState(undefined);
  const [phone, setPhone] = useState(undefined);
  // NOTE. Setting null to photo means default image is used
  const [localBackgroundPhoto, setLocalBackgroundPhoto] = useState(undefined);
  const [localProfilePhoto, setLocalProfilePhoto] = useState(undefined);
  // 프로필 이미지 변경시 파일 객체
  const [changedProfilePhotoFile, setChangedProfilePhotoFile] = useState(
    undefined,
  );
  const [changedBackgroundPhotoFile, setChangedBackgroundPhotoFile] = useState(
    undefined,
  );

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
    setStatusMsg(profile?.profileStatusMsg);
    setCompanyNum(profile?.companyNum);
    setPhone(profile?.phone);
    setLocalProfilePhoto(undefined);
    setLocalBackgroundPhoto(undefined);
    setChangedProfilePhotoFile(undefined);
    setChangedBackgroundPhotoFile(undefined);
  };

  const resetLocalInputData = () => {
    setNick(undefined);
    setStatusMsg(undefined);
    setCompanyNum(undefined);
    setPhone(undefined);
    setLocalProfilePhoto(undefined);
    setLocalBackgroundPhoto(undefined);
    setChangedProfilePhotoFile(undefined);
    setChangedBackgroundPhotoFile(undefined);
  };

  const isValidInputData = () => !!nick;

  useEffect(() => {
    if (isEditMode) {
      setLocalProfilePhoto(undefined);
      setLocalBackgroundPhoto(undefined);
      setChangedProfilePhotoFile(undefined);
      setChangedBackgroundPhotoFile(undefined);
    }
    setEditMode(false);
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

  const handleTalkClick = async () => {
    const myUserId = userStore.myProfile.id;
    handleProfileMenuClick(
      myUserId,
      userId,
      async roomInfo => {
        const routingHistory = (
          await userStore.getRoutingHistory({
            userId: userStore.myProfile.id,
            roomId: roomInfo.id,
          })
        )?.[0];
        history.push(routingHistory?.lastUrl || `/s/${roomInfo.id}/talk`);
      },
      roomInfo => history.push(`/s/${roomInfo.id}/talk`),
      newRoomInfo => history.push(`/s/${newRoomInfo?.id}/talk`),
    );
  };

  const handleMeetingClick = async () => {
    const myUserId = userStore.myProfile.id;
    // const queryParams = { ...getQueryParams(), sub: 'meeting' };
    const queryString = getQueryString(getQueryParams());
    const openMeeting = roomInfo => {
      PlatformUIStore.openWindow({
        id: roomInfo.id,
        type: 'meeting',
        name: null,
        userCount: null,
        handler: null,
      });
    };
    handleProfileMenuClick(
      myUserId,
      userId,
      roomInfo => {
        openMeeting(roomInfo);
        history.push(`/s/${roomInfo.id}/talk?${queryString}`);
      },
      roomInfo => {
        openMeeting(roomInfo);
        history.push(`/s/${roomInfo.id}/talk?${queryString}`);
      },
      newRoomInfo => {
        openMeeting(newRoomInfo);
        history.push(`/s/${newRoomInfo?.id}/talk?${queryString}`);
      },
    );
  };

  const handleChangetoEditMode = () => {
    setEditMode(true);
    setLocalInputData();
  };

  const handleChangeBackground = file => {
    setIsChange(true);
    setChangedBackgroundPhotoFile(file);
    setLocalBackgroundPhoto(URL.createObjectURL(file));
  };
  const handleChangeDefaultBackground = () => {
    setIsChange(true);
    setLocalBackgroundPhoto(null);
    setChangedBackgroundPhotoFile(undefined);
  };

  const handleChangePhoto = file => {
    setIsChange(true);
    setChangedProfilePhotoFile(file);
    setLocalProfilePhoto(URL.createObjectURL(file));
  };
  const handleChangeDefaultPhoto = () => {
    setIsChange(true);
    setLocalProfilePhoto(null);
    setChangedProfilePhotoFile(undefined);
  };

  const handleConfirm = async () => {
    let thumbFile;
    if (localProfilePhoto?.includes('blob:')) {
      thumbFile = changedProfilePhotoFile;
      URL.revokeObjectURL(localProfilePhoto);
    } else if (localProfilePhoto === null) thumbFile = null;

    let backgroundFile;
    if (localBackgroundPhoto?.includes('blob:')) {
      backgroundFile = changedBackgroundPhotoFile;
      URL.revokeObjectURL(localBackgroundPhoto);
    } else if (localBackgroundPhoto === null) backgroundFile = null;

    const updatedInfo = getProfileEditDto({
      nick,
      companyNum,
      phone,
      profileStatusMsg: statusMsg,
      thumbFile,
      backgroundFile,
    });

    // // default photo가 아닌 프로필 사진으로 변경을 시도한 경우
    // if (localProfilePhoto?.includes('blob:')) {
    //   // const blobImage = await toBlob(localProfilePhoto);
    //   // const base64Image = await toBase64(blobImage);
    //   updatedInfo.profilePhoto = null; // base64Image
    //   updatedInfo.profileFile = changedProfilePhotoFile;
    //   updatedInfo.profileName = changedProfilePhotoFile?.name;
    //   URL.revokeObjectURL(localProfilePhoto);
    // } else {
    //   // default photo로 변경 시도 혹은 변경 없는 경우
    //   // The null value means default photo
    //   updatedInfo.profilePhoto =
    //     localProfilePhoto === null ? localProfilePhoto : getProfilePhoto();
    //   updatedInfo.profileFile = null;
    //   updatedInfo.profileName = null;
    // }
    await userStore.updateMyProfile({ updatedInfo });

    resetLocalInputData();
    setIsChange(false);
    setEditMode(false);
  };

  const handleExit = () => {
    setIsChange(false);
    setEditMode(false);
    resetLocalInputData();
    setCancelDialogVisible(false);
  };
  const handleCancel = () => {
    if (isChange) setCancelDialogVisible(true);
    else handleExit();
  };

  const handleToggleFavoriteFriend = async event => {
    if (event) event.stopPropagation();
    const isFav = !friendStore.isFavoriteFriend(userId);
    try {
      await friendStore.setFriendFavorite({
        myUserId: userStore.myProfile.id,
        friendId: userId,
        isFav,
      });

      if (isFav) setToastText(t('CM_BOOKMARK_03'));
      else setToastText(t('CM_BOOKMARK_02'));

      setIsToastVisible(true);
    } catch (e) {
      console.log(`Toggle Favorites Error is...${e}`);
    }
  };

  const isDisabled = () => {
    const { id: myId } = userStore.myProfile;
    const hasPermission = authStore.hasPermission('rooms', 'C');
    const { result: isExistRoom } = roomStore.getDMRoom(myId, userId);

    // NOTE : 방이 있으면 R, 없으면 C
    if (isExistRoom) return false;
    return !hasPermission;
  };

  return (
    <>
      <Wrapper imageSrc={renderBackgroundPhoto}>
        <Sidebar>
          <StyledButton
            className="profile__talk-button"
            onClick={handleTalkClick}
            disabled={isDisabled()}
          >
            <ChattingWithMeIcon
              width={1.88}
              height={1.88}
              color={isDisabled() ? '#646464' : '#fff'}
            />
            <Text style={{ marginTop: '0.5rem' }}>
              {isMyId() ? t('CM_MY_TALK_13') : `1:1 ${t('CM_TALK')}`}
            </Text>
          </StyledButton>
          {isMyId() ? (
            <StyledButton
              className="profile__edit-button"
              onClick={handleChangetoEditMode}
            >
              <StyleIcon iconimg="profile" />
              <Text>{t('CM_EDIT_PROFILE')}</Text>
            </StyledButton>
          ) : (
            <StyledButton
              className="profile__meeting-button"
              onClick={handleMeetingClick}
              disabled={isDisabled()}
            >
              <MeetingIcon
                width={1.88}
                height={1.88}
                color={isDisabled() ? '#646464' : '#fff'}
              />
              <Text style={{ marginTop: '0.5rem' }}>1:1 Meeting</Text>
            </StyledButton>
          )}
        </Sidebar>

        <Content>
          <ContentTop>
            {isEditMode && (
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
                        {t('CM_EDIT_PROFILE_04')}
                      </StyledUpload>
                    </Menu.Item>
                    <Menu.Item
                      disabled={isDefaultBackgroundPhotoUsed}
                      onClick={handleChangeDefaultBackground}
                    >
                      {t('CM_EDIT_PROFILE_05')}
                    </Menu.Item>
                  </Menu>
                }
              >
                <ImageChangeButton>
                  <CameraIcon width="1.25" height="1.25" color="#fff" />
                </ImageChangeButton>
              </Dropdown>
            )}
            {!isEditMode && !(userId === userStore.myProfile.id) && (
              <BookMarkButton
                className="profile__bookmark-button"
                isFav={friendStore.isFavoriteFriend(userId)}
                onClick={handleToggleFavoriteFriend}
              >
                <Blind>{t('CM_BOOKMARK')}</Blind>
              </BookMarkButton>
            )}
          </ContentTop>
          <ContentBody>
            <UserImageWrapper position="br">
              <UserImage src={renderProfilePhoto} />
              {isMyId() && isEditMode && (
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
                            {t('CM_B2C_SETTING_CHANGE_INFO_22')}
                          </StyledUpload>
                        </Menu.Item>
                        <Menu.Item
                          disabled={isDefaultProfilePhotoUsed}
                          onClick={handleChangeDefaultPhoto}
                        >
                          {t('CM_EDIT_PROFILE_05')}
                        </Menu.Item>
                      </Menu>
                    }
                  >
                    <CameraBox>
                      <CameraIcon width="1.88" height="1.88" color="#fff" />
                    </CameraBox>
                  </Dropdown>
                </ImageChange>
              )}
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
            <StatusText isEditMode={isEditMode}>
              {isEditMode ? (
                <EditNameInput
                  maxLength={50}
                  placeholder={t('CM_B2C_CONTENTS_AREA_EMPTY_PAGE_36')}
                  onChange={e => {
                    setIsChange(true);
                    setStatusMsg(e);
                  }}
                  value={
                    statusMsg !== undefined
                      ? statusMsg
                      : profile?.profileStatusMsg
                  }
                  isStatusMsg
                />
              ) : (
                profile?.profileStatusMsg
              )}
            </StatusText>
            {/* <Tooltip placement="bottom" title={t('CM_EDIT_ONLY_ADMIN')} color="#4C535D"></Tooltip> */}
            <UserInfoList>
              {userType === 'USR0001' && (
                <UserInfoItem style={{ alignItems: 'flex-start' }}>
                  <StyleOfficeIcon iconimg="address" />
                  <UserInfoText>
                    <span style={{ whiteSpace: 'break-spaces' }}>
                      {profile?.getFullCompanyJob()}
                    </span>
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
                      placeholder={t('CM_B3C_CONTENTS_AREA_EMPTY_PAGE_30')}
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
                    placeholder={t('CM_B2C_CONTENTS_AREA_EMPTY_PAGE_35')}
                  />
                ) : (
                  <UserInfoText>
                    <span>{getMobileNumber(profile)}</span>
                  </UserInfoText>
                )}
              </UserInfoItem>
            </UserInfoList>
            <ButtonContainer>
              {isEditMode && (
                <>
                  <Button
                    style={{
                      marginRight: '1.25rem',
                    }}
                    type="solid"
                    className="color-green"
                    disabled={!isChange || !isValidInputData()}
                    onClick={handleConfirm}
                  >
                    {t('CM_SAVE')}
                  </Button>
                  <ButtonCancel type="outlined" onClick={handleCancel}>
                    {t('CM_CANCEL')}
                  </ButtonCancel>
                </>
              )}
            </ButtonContainer>
          </ContentBody>
        </Content>
      </Wrapper>
      {cancelDialogVisible && (
        <Message
          visible={cancelDialogVisible}
          title={t('CM_Q_EXIT_SAVE')}
          type="error"
          btns={[
            {
              type: 'solid',
              shape: 'round',
              text: t('CM_LEAVE'),
              onClick: handleExit,
            },
            {
              type: 'outlined',
              shape: 'round',
              text: t('CM_CANCEL'),
              onClick: () => setCancelDialogVisible(false),
            },
          ]}
        />
      )}
      <Toast
        visible={isToastVisible}
        timeoutMs={1000}
        onClose={() => setIsToastVisible(false)}
      >
        {toastText}
      </Toast>
    </>
  );
});

export default MainProfile;
