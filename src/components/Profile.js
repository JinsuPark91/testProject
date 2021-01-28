import React, { useEffect, useState, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import Upload from 'rc-upload';
import styled, { css } from 'styled-components';
import { Button, Input, Dropdown, Menu, Tooltip } from 'antd';
import { observer } from 'mobx-react';
import { useCoreStores, Message, Toast } from 'teespace-core';
import InputCounter from './Input';
import { LockLineIcon, CameraIcon } from './Icons';
import friendsIcon from '../assets/ts_friends.svg';
import profileEditIcon from '../assets/ts_profile_edit.svg';
import teeMeetingIcon from '../assets/ts_TeeMeeting.svg';
import OfficeIcon from '../assets/office.svg';
import CallIcon from '../assets/call.svg';
import PhoneIcon from '../assets/phone.svg';
import MailIcon from '../assets/mail.svg';
import EmailHoverIcon from '../assets/ts_export.svg';
import tsBgImgIcon from '../assets/ts_photo.svg';
import starLineIcon from '../assets/ts_star_line.svg';
import starIcon from '../assets/ts_star.svg';
import { getQueryParams, getQueryString } from '../utils/UrlUtil';

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
    const { roomStore, userStore, friendStore, authStore } = useCoreStores();
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

    // get profile from store
    const profile = userStore.userProfiles[userId];

    const isMyId = () => userId === userStore.myProfile.id;

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
      setPhone(profile?.companyNum);
      setMobile(profile?.phone);
      setName(profile?.nick || profile?.name);
      setStatusMsg(profile?.profileStatusMsg);
      setLocalProfilePhoto(undefined);
      setLocalBackgroundPhoto(undefined);
    };

    const resetLocalInputData = () => {
      setPhone(undefined);
      setMobile(undefined);
      setName(undefined);
      setStatusMsg(undefined);
      setLocalProfilePhoto(undefined);
      setLocalBackgroundPhoto(undefined);
    };

    const isValidInputData = () => !!name;

    useEffect(() => {
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

    const toBase64 = async blobImage =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(blobImage);
        reader.onload = () => resolve(reader.result);
        reader.onerror = err => reject(err);
      });

    const toBlob = async file => {
      const result = await fetch(file).then(r => r.blob());
      return result;
    };

    const handleChangeMode = () => {
      setEditMode(true);
      // set initial local input data
      setLocalInputData();
    };

    const handleMeetingClick = async () => {
      const queryParams = { ...getQueryParams(), sub: 'meeting' };
      const queryString = getQueryString(queryParams);

      try {
        const myUserId = userStore.myProfile.id;
        const { roomInfo } = roomStore.getDMRoom(myUserId, userId);
        if (roomInfo) {
          if (roomInfo.isVislble) {
            history.push(`/s/${roomInfo.id}/talk?${queryString}`);
          } else {
            await roomStore.updateRoomMemberSetting({
              roomId: roomInfo.id,
              myUserId,
              newIsVisible: true,
            });
          }
          history.push(`/s/${roomInfo.id}/talk?${queryString}`);
        } else {
          const { roomId } = await roomStore.createRoom({
            creatorId: userStore.myProfile.id,
            userList: [{ userId }],
          });
          history.push(`/s/${roomId}/talk?${queryString}`);
        }
      } catch (e) {
        console.error(`Error is${e}`);
      }
    };

    const handleChangeBackground = file => {
      setIsChange(true);
      setLocalBackgroundPhoto(URL.createObjectURL(file));
    };

    const handleChangePhoto = file => {
      setIsChange(true);
      setLocalProfilePhoto(URL.createObjectURL(file));
    };

    const handleChangeDefaultBackground = () => {
      setIsChange(true);
      setLocalBackgroundPhoto(null);
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

      // Update my profile information
      await userStore.updateMyProfile({ updatedInfo });

      // Reset local input date
      resetLocalInputData();

      setIsChange(false);
      setEditMode(false);

      onClickSaveBtn();
    };

    const handleExit = () => {
      setIsChange(false);
      setEditMode(false);

      // Reset local input date
      resetLocalInputData();

      // hide confirm dialog
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

    const handleTalkClick = async () => {
      try {
        const myUserId = userStore.myProfile.id;
        const { roomInfo } = roomStore.getDMRoom(myUserId, userId);

        if (roomInfo) {
          // 이미 룸리스트에 있는경우
          if (roomInfo.isVisible) {
            const routingHistory = (
              await userStore.getRoutingHistory({
                userId: userStore.myProfile.id,
                roomId: roomInfo.id,
              })
            )?.[0];

            history.push(routingHistory?.lastUrl || `/s/${roomInfo.id}/talk`);
          }
          // 방은 있지만 룸리스트에 없는 경우 (나간경우)
          else {
            await roomStore.updateRoomMemberSetting({
              roomId: roomInfo.id,
              myUserId,
              newIsVisible: true,
            });
            history.push(`/s/${roomInfo.id}/talk`);
          }
        }
        // 아예 방이 없는 경우 (한번도 대화한적이 없음)
        else {
          const { roomId } = await roomStore.createRoom({
            creatorId: userStore.myProfile.id,
            userList: [{ userId }],
          });
          history.push(`/s/${roomId}/talk`);
        }
      } catch (e) {
        console.error(`Error is${e}`);
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
        <Wrapper imageSrc={renderBackgroundPhoto}>
          {showSider && (
            <Sidebar>
              <StyledButton onClick={handleTalkClick}>
                <FriendsIcon />
                <Text>{isMyId() ? `나와의 Talk` : `1:1 Talk`}</Text>
              </StyledButton>
              {isMyId() ? (
                <StyledButton onClick={handleChangeMode}>
                  <StyleIcon iconimg="profile" />
                  <Text>프로필 편집</Text>
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
                    <StyleBgImgIcon />
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
                    placeholder="별명을 입력해주세요."
                    onChange={e => {
                      setIsChange(true);
                      setName(e);
                    }}
                    value={
                      name !== undefined ? name : profile?.nick || profile?.name
                    }
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
              <UserInfoList>
                {userType === 'USR0001' && (
                  <UserInfoItem style={{ alignItems: 'flex-start' }}>
                    <StyleOfficeIcon iconimg="address" />
                    <UserInfoText>
                      <span style={{ whiteSpace: 'break-spaces' }}>
                        {profile?.getFullCompanyJob()}
                      </span>
                      {editEnabled && (
                        <Tooltip
                          placement="bottomLeft"
                          title="어드민만 변경 가능"
                          color="#75757f"
                        >
                          <LockIconBox>
                            <LockLineIcon width="0.88" height="0.88" />
                          </LockIconBox>
                        </Tooltip>
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
                      />
                    ) : profile?.companyNum ? (
                      <UserInfoText>
                        {`${profile?.nationalCode} ${profile?.companyNum}`}
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
                    />
                  ) : (
                    <UserInfoText>
                      {profile?.phone
                        ? `${profile?.nationalCode} ${profile?.phone}`
                        : `-`}
                    </UserInfoText>
                  )}
                </UserInfoItem>
                {/* 프로필 편집 시 "email" class 삭제 */}
                {/* <UserInfoItem
                  className={editEnabled ? '' : 'email'}
                  onClick={() => {
                    console.log('todo');
                  }}
                >
                  <StyleOfficeIcon iconimg="email" />
                  <StyleOfficeIcon iconimg="emailhover" />
                  <UserInfoText>{profile?.email}</UserInfoText>
                </UserInfoItem> */}
              </UserInfoList>
              <ButtonContainer>
                {editEnabled && (
                  <>
                    <Button
                      style={{ marginRight: '1.25rem' }}
                      type="solid"
                      shape="round"
                      disabled={!isChange || !isValidInputData()}
                      onClick={handleConfirm}
                    >
                      저장
                    </Button>
                    <Button
                      type="outlined"
                      shape="round"
                      onClick={handleCancel}
                      style={{ backgroundColor: '#fff' }}
                    >
                      취소
                    </Button>
                  </>
                )}
              </ButtonContainer>
            </ContentBody>
          </Content>
        </Wrapper>
      </>
    );
  },
);

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
  width: 100%;
  height: 100%;
  background-image: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)),
    url('${props => props.imageSrc}');
  background-repeat: no-repeat;
  background-size: 100% 100%;
`;

const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: ${props => (props.isVertical ? '100%' : '9.38rem')};
  height: ${props => (props.isVertical ? '200px' : '100%')};
  background: rgba(0, 0, 0, 0.3);
`;

const StyledUpload = styled(Upload)`
  &:focus {
    outline: 0;
  }
`;

const Text = styled.span`
  overflow: hidden;
  display: block;
  max-width: 14.69rem;
  width: 100%;
  color: #fff;
  line-height: 1.19rem;
  font-size: 0.81rem;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: center;
`;

const UserEmailText = styled(Text)`
  margin-top: 0.25rem;
  line-height: 1.25rem;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.875rem;
`;

const ImageChangeButton = styled(Text)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
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
  width: 5.38rem;
  height: 5.38rem;
  margin-top: 3rem;
  &:first-of-type {
    margin-top: 0;
  }
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.4);
    border-radius: 4px;
    border-radius: 4px;
    cursor: pointer;
  }
`;

const Content = styled.div`
  overflow: hidden;
  display: flex;
  position: relative;
  width: 100%;
  height: 100%;
  flex-direction: column;
  align-items: center;
`;

const ContentTop = styled.div`
  display: flex;
  align-items: left;
  width: 100%;
  height: 8rem;
  padding: 0.25rem 0.25rem 0;
`;

const ContentBody = styled.div`
  display: flex;
  position: relative;
  width: 100%;
  height: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const UserImageWrapper = styled.div`
  position: relative;
  width: 6.88rem;
  height: 6.88rem;
  background: #fff;
  border-radius: 50%;
  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border: 2px solid rgba(255, 255, 255, 0.2);
    border-radius: 50%;
  }
`;
const UserImage = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
`;

const UserInfoList = styled.div`
  min-width: 14.69rem;
  display: flex;
  flex-direction: column;
`;

const UserInfoItem = styled.div`
  display: flex;
  align-items: center;
  margin-top: 0.94rem;
  &:first-of-type {
    margin-top: 3.75rem;
  }
  em + em {
    display: none;
  }
  &.email {
    em {
      &:last-of-type {
        display: none;
      }
    }
    &:hover {
      cursor: pointer;
      span {
        text-decoration: underline;
      }
      em {
        &:first-of-type {
          display: none;
        }
        &:last-of-type {
          display: block;
        }
      }
    }
  }
  .anticon-lock {
    margin: auto 0;
    padding-left: 0.3125rem;
    font-size: 0.88rem;
    color: #75757f;
  }
`;
const BigText = styled(Text)`
  margin-top: 1.56rem;
  line-height: 2.25rem;
  font-size: 1.5rem;
`;

const ButtonContainer = styled.div`
  height: 50px;
  margin-top: 1.25rem;
  display: flex;
`;

const FriendsIcon = styled.span`
  display: inline-block;
  width: 1.88rem;
  height: 1.88rem;
  margin-bottom: 0.5rem;
  background-image: url(${friendsIcon});
  background-repeat: no-repeat;
  background-size: 1.88rem 1.88rem;
`;

const StyleIcon = styled.span`
  display: inline-block;
  width: 1.88rem;
  height: 1.88rem;
  margin-bottom: 0.5rem;
  background-repeat: no-repeat;
  background-size: 1.88rem 1.88rem;
  ${props => {
    switch (props.iconimg) {
      case 'profile':
      default:
        return css`
          background-image: url(${profileEditIcon});
        `;

      case 'meeting':
        return css`
          background-image: url(${teeMeetingIcon});
        `;
    }
  }}
`;

const UserInfoText = styled.span`
  overflow: hidden;
  display: flex;
  align-items: center;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-size: 0.88rem;
  line-height: 1.25rem;
  color: #fff;
`;

const StyleOfficeIcon = styled.em`
  display: inline-block;
  width: 1.25rem;
  height: 1.25rem;
  margin-right: 0.75rem;
  background-repeat: no-repeat;
  background-size: 1.25rem 1.25rem;
  ${props => {
    switch (props.iconimg) {
      case 'address':
      default:
        return css`
          background-image: url(${OfficeIcon});
        `;

      case 'company':
        return css`
          background-image: url(${CallIcon});
        `;

      case 'phone':
        return css`
          background-image: url(${PhoneIcon});
        `;

      case 'email':
        return css`
          background-image: url(${MailIcon});
        `;

      case 'emailhover':
        return css`
          background-image: url(${EmailHoverIcon});
        `;
    }
  }}
`;

const EditNameInput = styled(InputCounter)`
  flex-direction: column;
  height: auto;
  padding: 0;
  border: 0 !important;
  border-radius: 0;
  background-color: transparent;
  &:not(:disabled):focus-within {
    input {
      border-color: #6c56e5;
    }
  }
  &:hover {
    background-color: transparent;
  }
  input {
    height: 2.25rem;
    margin: 0;
    padding-bottom: 0.56rem;
    border-bottom: 1px solid #fff;
    font-size: 1.5rem;
    text-align: center;
  }
  .input-counter {
    font-size: 0.88rem;
    line-height: 1.25rem;
    color: #fff;
    opacity: 0.7;
  }
`;

const StyleInput = styled(Input)`
  &.ant-input {
    background-color: transparent;
    border: 0;
    border-bottom: 1px solid #fff;
    border-radius: 0;
    color: #fff;
    font-size: 0.88rem;
    &:hover:not(:disabled),
    &:active:not(:disabled),
    &:focus:not(:disabled) {
      color: #fff;
      background-color: transparent;
    }
    &::placeholder {
      color: #fff;
      opacity: 50%;
    }
    &.type2 {
      text-align: center;
    }
  }
`;

const StyleBgImgIcon = styled.span`
  width: 1rem;
  height: 1rem;
  background-image: url(${tsBgImgIcon});
  background-repeat: no-repeat;
  background-size: 1rem 1rem;
`;

const UserStatusMsg = styled.p`
  margin-top: 0.63rem;
  font-size: 0.88rem;
  line-height: 1.25rem;
  color: #ffffff;
  letter-spacing: 0;
  text-align: center;
`;

const TopButton = styled.button`
  width: 3rem;
  height: 3rem;
  background-color: transparent;
  border-radius: 50%;
  border: 0;
  cursor: pointer;
  ${props => {
    return css`
      background: url(${starLineIcon}) no-repeat 50% 50%;
      background-size: 1.13rem 1.13rem;
      &:hover {
        background-color: rgba(255, 255, 255, 0.3);
      }
      &:active {
        background-image: url(${starIcon});
        background-color: rgba(90, 95, 255, 0.8);
      }
      ${props.isFav
        ? `background-image: url(${starIcon});`
        : `background-image: url(${starLineIcon});`}
    `;
  }}
`;

const Blind = styled.span`
  position: absolute;
  clip: rect(0 0 0 0);
  width: 1px;
  height: 1px;
  margin: -1px;
  overflow: hidden;
`;

const LockIconBox = styled.span`
  margin: auto 0;
  padding-left: 0.3125rem;
  color: #75757f;
  line-height: 0;
`;

const ImageChange = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.5);
`;

const CameraBox = styled.span`
  line-height: 0;
  z-index: 5;
  cursor: pointer;
`;

export default Profile;
