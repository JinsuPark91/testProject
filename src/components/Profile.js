import React, { useEffect, useState, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Dropdown, Menu } from 'antd';
import { observer } from 'mobx-react';
import { useCoreStores, Message, Toast } from 'teespace-core';
import { useTranslation } from 'react-i18next';
import { LockLineIcon, CameraIcon } from './Icons';
import { getQueryParams, getQueryString } from '../utils/UrlUtil';
import PlatformUIStore from '../stores/PlatformUIStore';
import {
  handleProfileMenuClick,
  toBase64,
  toBlob,
  getCompanyNumber,
  getMobileNumber,
} from '../utils/ProfileUtil';
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
  ButtonContainer,
  FriendsIcon,
  StyleIcon,
  UserInfoText,
  StyleOfficeIcon,
  EditNameInput,
  StyleInput,
  TopButton,
  Blind,
  LockIconBox,
  ImageChange,
  CameraBox,
} from '../styles/ProfileStyle';

const Profile = observer(
  ({
    userId = null,
    editOnlyMode = false,
    showSider = true,
    onModeChange = null,
    onClickSaveBtn = () => {},
    onClickCancelBtn = () => {},
  }) => {
    const history = useHistory();
    const { t } = useTranslation();

    const { userStore, friendStore, authStore } = useCoreStores();
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

    const isValidInputData = () => !!name;

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

    const handleToggleFavoriteFriend = useCallback(
      async event => {
        if (event) event.stopPropagation();
        const isFav = !friendStore.isFavoriteFriend(userId);
        try {
          await friendStore.setFriendFavorite({
            myUserId: userStore.myProfile.id,
            friendId: userId,
            isFav,
          });

          if (isFav) {
            setToastText('즐겨찾기가 설정되었습니다.');
          } else {
            setToastText('즐겨찾기가 해제되었습니다.');
          }
          setIsToastVisible(true);
        } catch (e) {
          console.log(e);
        }
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [friendStore, userId],
    );

    // check edit mode
    const editEnabled = editOnlyMode || isEditMode;

    return (
      <>
        <Wrapper imageSrc={renderBackgroundPhoto}>
          {showSider && (
            <Sidebar>
              <StyledButton onClick={handleTalkClick}>
                <FriendsIcon />
                <Text>
                  {isMyId()
                    ? `${t(`WEB_COMMON_B2C_CONTENTS_AREA_EMPTY_PAGE_13`)}`
                    : `1:1 Talk`}
                </Text>
              </StyledButton>
              {isMyId() ? (
                <StyledButton onClick={handleChangetoEditMode}>
                  <StyleIcon iconimg="profile" />
                  <Text>{t('WEB_COMMON_B2C_CONTENTS_AREA_EMPTY_PAGE_14')}</Text>
                </StyledButton>
              ) : (
                <StyledButton onClick={handleMeetingClick}>
                  <StyleIcon iconimg="meeting" />
                  <Text>1:1 Meeting</Text>
                </StyledButton>
              )}
            </Sidebar>
          )}
          <Content showSider={showSider}>
            <ContentTop>
              {editEnabled && (
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
                  <ImageChangeButton position="tl">
                    <CameraIcon width="1.25" height="1.25" />
                  </ImageChangeButton>
                </Dropdown>
              )}
              {!editEnabled && !(userId === userStore.myProfile.id) && (
                <TopButton
                  type="bookMark"
                  isFav={friendStore.isFavoriteFriend(userId)}
                  onClick={handleToggleFavoriteFriend}
                >
                  <Blind>즐겨찾기</Blind>
                </TopButton>
              )}
            </ContentTop>
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
                  profile?.nick || profile?.name
                )}
              </BigText>
              {!editEnabled && (
                <UserEmailText>{`(${profile?.loginId})`}</UserEmailText>
              )}
              {/* NOTE 프로파일 상태 메시지는 추후에 지원함.
              <UserStatusMsg>
                {editEnabled ? (
                  <StyleInput
                    className="type2"
                    onChange={e => {
                      setIsChange(true);
                      setStatusMsg(e.target.value);
                    }}
                    value={
                      statusMsg !== undefined
                        ? statusMsg
                        : profile?.profileStatusMsg
                    }
                  />
                ) : (
                  profile?.profileStatusMsg
                )}
              </UserStatusMsg>
              */}
              {/* <Tooltip placement="bottom" title="어드민만 변경 가능" color="#4C535D"></Tooltip> */}
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
                    ) : profile?.companyNum ? (
                      <UserInfoText>
                        <span>{getCompanyNumber(profile)}</span>
                      </UserInfoText>
                    ) : (
                      <UserInfoText>-</UserInfoText>
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
              <ButtonContainer>
                {editEnabled && (
                  <>
                    <Button
                      style={{
                        color: '#ffffff',
                        marginRight: '1.25rem',
                        border: 'none',
                      }}
                      type="solid"
                      disabled={!isChange || !isValidInputData()}
                      onClick={handleConfirm}
                    >
                      저장
                    </Button>
                    <Button
                      type="outlined"
                      onClick={handleCancel}
                      style={{ backgroundColor: '#fff', color: '#3b3b3b' }}
                    >
                      취소
                    </Button>
                  </>
                )}
              </ButtonContainer>
            </ContentBody>
          </Content>
        </Wrapper>
        <Message
          visible={cancelDialogVisible}
          title="변경 사항을 저장하지 않고 나가시겠습니까?"
          type="error"
          btns={[
            {
              type: 'solid',
              shape: 'round',
              text: '나가기',
              onClick: handleExit,
            },
            {
              type: 'outlined',
              shape: 'round',
              text: '취소',
              onClick: handleExitCancel,
            },
          ]}
        />
        <Toast
          visible={isToastVisible}
          timeoutMs={1000}
          onClose={() => setIsToastVisible(false)}
        >
          {toastText}
        </Toast>
      </>
    );
  },
);

export default Profile;
