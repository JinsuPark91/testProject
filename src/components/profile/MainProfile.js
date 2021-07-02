import React, { useEffect, useState, useCallback, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Dropdown, Menu } from 'antd';
import { observer } from 'mobx-react';
import { useCoreStores, Tooltip, StatusSelector } from 'teespace-core';
import { useTranslation } from 'react-i18next';
import { ThemeContext } from 'styled-components';
import { useStores } from '../../stores';
import {
  handleProfileMenuClick,
  getCompanyNumber,
  getMobileNumber,
  updateMyProfile,
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
  GuestText,
  ButtonContainer,
  StyleIcon,
  UserInfoText,
  UserOrgText,
  StyleOfficeIcon,
  EditNameInput,
  StyleInput,
  BookMarkButton,
  Blind,
  LockIconBox,
  ImageChange,
  CameraBox,
  ButtonCancel,
  StatusSelectorWrapper,
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

  const {
    userStore,
    friendStore,
    authStore,
    roomStore,
    configStore,
  } = useCoreStores();
  const themeContext = useContext(ThemeContext);
  const { uiStore, historyStore } = useStores();
  const [isEditMode, setEditMode] = useState(false);
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
  const { isGuest } = profile;
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

  const isSelectable = () => {
    return userId === userStore.myProfile.id;
  };

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

  const handleMoveTalkHistory = async roomInfo => {
    const { lastUrl } = await historyStore.getHistory({
      roomId: roomInfo.id,
    });
    if (lastUrl) history.push(lastUrl);
    else history.push(`/s/${roomInfo.id}/talk`);
  };
  const handleMoveTalk = roomInfo => history.push(`/s/${roomInfo.id}/talk`);

  const handleOpenMeeting = roomInfo => {
    uiStore.openWindow({
      id: roomInfo.id,
      type: 'meeting',
      name: null,
      userCount: null,
      handler: null,
    });
  };
  const handleMoveMeetingHistory = async roomInfo => {
    handleOpenMeeting(roomInfo);
    await handleMoveTalkHistory(roomInfo);
  };
  const handleMoveMeeting = roomInfo => {
    handleOpenMeeting(roomInfo);
    handleMoveTalk(roomInfo);
  };

  // 나간 1:1 방에도 히스토리 따라가야 하는지 추후 확인 필요
  const handleTalkClick = async () => {
    const myUserId = userStore.myProfile.id;
    handleProfileMenuClick(
      myUserId,
      userId,
      handleMoveTalkHistory,
      handleMoveTalk,
    );
  };

  const handleMeetingClick = async () => {
    const myUserId = userStore.myProfile.id;
    // const queryParams = { ...getQueryParams(), sub: 'meeting' };
    // const queryString = getQueryString(getQueryParams());
    handleProfileMenuClick(
      myUserId,
      userId,
      handleMoveMeetingHistory,
      handleMoveMeeting,
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

    await updateMyProfile({
      nick,
      companyNum,
      phone,
      profileStatusMsg: statusMsg,
      thumbFile,
      backgroundFile,
    });

    resetLocalInputData();
    setIsChange(false);
    setEditMode(false);
  };

  const handleExit = () => {
    setIsChange(false);
    setEditMode(false);
    resetLocalInputData();
    uiStore.closeMessage();
  };
  const handleCancel = () => {
    if (isChange)
      uiStore.openMessage({
        title: t('CM_Q_EXIT_SAVE'),
        type: 'error',
        buttons: [
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
            onClick: () => {
              uiStore.closeMessage();
            },
          },
        ],
      });
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

      let text = '';
      if (isFav) text = t('CM_BOOKMARK_03');
      else text = t('CM_BOOKMARK_02');

      uiStore.openToast({
        text,
        onClose: () => {
          uiStore.closeToast();
        },
      });
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

  const handleNumber = useCallback(number => {
    if (number.length > 30) return number.substring(0, 30);
    return number;
  }, []);

  const getUserOrgText = count => {
    let userOrgText = '';
    const userOrgTextArr = count
      ? profile?.getFullCompanyJob(count).split(',')
      : profile?.getFullCompanyJob().split(',');
    userOrgTextArr.forEach(elem => {
      userOrgText = `${userOrgText + elem}\n`;
    });

    if (userOrgText) return userOrgText;
    return '-';
  };

  const getUserOrgInfo = () => {
    const VIEW_COUNT = 3;
    const userOrgCount = profile?.concurrentCount;
    const userOrgSubText = getUserOrgText(VIEW_COUNT);

    if (userOrgCount <= VIEW_COUNT)
      return <UserOrgText>{userOrgSubText}</UserOrgText>;

    const userOrgFullText = getUserOrgText();
    return (
      <Tooltip
        placement="bottom"
        title={userOrgFullText}
        color={themeContext.CoreLight}
        overlayStyle={{ whiteSpace: 'pre-line' }}
      >
        <UserOrgText>{userOrgSubText}</UserOrgText>
      </Tooltip>
    );
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

          {
            // eslint-disable-next-line no-nested-ternary
            isMyId() ? (
              <StyledButton
                className="profile__edit-button"
                onClick={handleChangetoEditMode}
              >
                <StyleIcon iconimg="profile" />
                <Text>{t('CM_EDIT_PROFILE')}</Text>
              </StyledButton>
            ) : configStore.isActivateForCNU('Meeting') ? (
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
            ) : null
          }
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
            {!isEditMode && (
              <StatusSelectorWrapper>
                <StatusSelector userId={userId} selectable={isSelectable()} />
              </StatusSelectorWrapper>
            )}
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
            {isGuest && <GuestText>{t('CM_GUEST')}</GuestText>}
            <UserInfoList>
              {userType === 'USR0001' && !isGuest && (
                <UserInfoItem style={{ alignItems: 'flex-start' }}>
                  <StyleOfficeIcon iconimg="address" />
                  <UserInfoText>
                    {getUserOrgInfo()}
                    {isEditMode && (
                      <LockIconBox>
                        <LockLineIcon width="0.88" height="0.88" />
                      </LockIconBox>
                    )}
                  </UserInfoText>
                </UserInfoItem>
              )}
              {userType === 'USR0001' && !isGuest && (
                <UserInfoItem>
                  <StyleOfficeIcon iconimg="company" />
                  {isEditMode ? (
                    <StyleInput
                      onChange={e => {
                        const companyText = handleNumber(e.target.value);
                        setCompanyNum(companyText);
                        setIsChange(true);
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
                      const phoneText = handleNumber(e.target.value);
                      setPhone(phoneText);
                      setIsChange(true);
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
    </>
  );
});

export default MainProfile;
