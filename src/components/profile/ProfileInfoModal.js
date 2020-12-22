import React, { useEffect, useState, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { Input, Button, Dropdown, Modal, Menu, Tooltip } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import { LockLineIcon } from '../Icons';
import { useCoreStores } from 'teespace-core';
import Upload from 'rc-upload';
import { useObserver } from 'mobx-react';
import InputCounter from '../Input';
import ProfileModal from './ProfileModal';
import tsOfficeIcon from '../../assets/ts_office.svg';
import tsCallIcon from '../../assets/ts_call.svg';
import tsPhoneIcon from '../../assets/ts_phone.svg';
import tsMailIcon from '../../assets/ts_mail.svg';
import talkIconB from '../../assets/ts_teeTalk_black.svg';
import editIcon from '../../assets/ts_edit.svg';
import teeMeetingIconB from '../../assets/ts_teemeeting_black.svg';
import tsCameraImgIcon from '../../assets/ts_camera.svg';
import addIcon from '../../assets/ts_friends_add.svg';
import photoIcon from '../../assets/ts_photo.svg';
import ProfileImageModal from './ProfileImageModal';

function ProfileInfoModal({
  userId = '',
  visible,
  onClose = () => {},
  onClickTalk = () => {},
  onClickMeeting = () => {},
  position,
  editMode = false,
}) {
  const history = useHistory();
  const { userStore, friendStore, roomStore, authStore } = useCoreStores();
  const [isEditMode, setIsEditMode] = useState(editMode);
  const [imageModal, setImageModal] = useState(false);
  const [userType, setUserType] = useState('');
  const [isChange, setIsChange] = useState(false);

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
  const [profile, setProfile] = useState(userStore.userProfiles[userId]);

  const getBackPhoto = () => {
    return userStore.getBackgroundPhotoURL(userId);
  };

  // calculate photo
  const renderProfilePhoto =
    localProfilePhoto === null
      ? profile.defaultPhotoUrl
      : localProfilePhoto || userStore.getProfilePhotoURL(userId, 'medium');

  // calculate whether default url be shown
  const isDefaultProfilePhotoUsed =
    localProfilePhoto === null ||
    (localProfilePhoto === undefined && !profile?.thumbPhoto);
  const isDefaultBackgroundPhotoUsed =
    localBackgroundPhoto === null ||
    (localBackgroundPhoto === undefined && !profile?.thumbBack);

  const setLocalInputData = useCallback(prof => {
    setPhone(prof?.companyNum);
    setMobile(prof?.phone);
    setName(prof?.nick || prof?.name);
    setStatusMsg(prof?.profileStatusMsg);
    setLocalProfilePhoto(undefined);
    setLocalBackgroundPhoto(undefined);
  }, []);

  const resetLocalInputData = () => {
    setPhone(undefined);
    setMobile(undefined);
    setName(undefined);
    setStatusMsg(undefined);
    setLocalProfilePhoto(undefined);
    setLocalBackgroundPhoto(undefined);
  };

  const isValidInputData = () => name === undefined || !!name;

  useEffect(() => {
    if (visible === false) return;
    (async () => {
      let userProfile = userStore.userProfiles[userId];
      // 프로파일 정보가 로딩되어 있지 않는 경우 로딩하고 로컬 스테이트 설정
      if (!userProfile) {
        userProfile = await userStore.getProfile({ userId });
      }
      setProfile(userProfile);

      const userAuthInfo = authStore.user;
      setUserType(userAuthInfo.type);
    })();
    // NOTE. 다이얼로그가 오픈될 때만(visble 이 true 가 된 시점) 호출되어야함.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, visible]);

  const isMyId = userId === userStore.myProfile.id;
  const isNotMyFriend = useCallback(
    () =>
      !isMyId &&
      friendStore.friendInfoList.findIndex(
        friend => friend.friendId === userId,
      ) === -1,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [friendStore.friendInfoList],
  );

  const handleCloseModal = useCallback(
    e => {
      if (e) e.stopPropagation();
      setImageModal(false);
      onClose();
    },
    [onClose],
  );

  const isFav = useCallback(() => {
    return friendStore.isFavoriteFriend(userId);
  }, [userId, friendStore]);

  const handleImageModal = useCallback(e => {
    if (e) e.stopPropagation();
    setImageModal(i => !i);
  }, []);

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

  const handleAddFriend = async () => {
    const friendInfo = await userStore.getProfile(userId);
    try {
      await friendStore.addFriend({
        myUserId: userStore.myProfile.id,
        friendInfo,
      });
    } catch (e) {
      console.log(e);
    }
  };

  const handleClickTalk = async () => {
    try {
      const myUserId = userStore.myProfile.id;
      const { roomInfo } = roomStore.getDMRoom(myUserId, userId);

      if (roomInfo) {
        if (roomInfo.isVislble) {
          history.push(`/s/${roomInfo.id}/talk`);
        } else {
          await roomStore.updateRoomMemberSetting({
            roomId: roomInfo.id,
            myUserId,
            newIsVisible: true,
          });
        }
        history.push(`/s/${roomInfo.id}/talk`);
      } else {
        const { roomId } = await roomStore.createRoom({
          creatorId: userStore.myProfile.id,
          userList: [{ userId }],
        });
        history.push(`/s/${roomId}/talk`);
      }
      onClose();
      onClickTalk();
    } catch (e) {
      console.error(`Error is${e}`);
    }
  };

  const handleClickEdit = useCallback(() => {
    setLocalInputData(profile);
    setIsEditMode(true);
  }, [profile, setLocalInputData]);

  const handleClickMeeting = async () => {
    // TODO 미팅 로직 추가 필요
    onClickMeeting();
  };

  const handleConfirm = async () => {
    // set update data from user input
    const updatedInfo = {};
    if (name || name === '') updatedInfo.nick = name;
    if (phone || phone === '') updatedInfo.companyNum = phone;
    if (mobile || mobile === '') updatedInfo.phone = mobile;
    if (statusMsg || statusMsg === '') updatedInfo.profileStatusMsg = statusMsg;

    if (localProfilePhoto?.includes('blob:')) {
      const blobImage = await toBlob(localProfilePhoto);
      const base64Image = await toBase64(blobImage);
      updatedInfo.profilePhoto = base64Image;

      URL.revokeObjectURL(localProfilePhoto);
    } else {
      // The null value means default photo
      updatedInfo.profilePhoto =
        localProfilePhoto === null
          ? localProfilePhoto
          : userStore.getProfilePhotoURL(userId, 'medium');
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
    setProfile(await userStore.updateMyProfile({ updatedInfo }));
    console.log(profile);

    // Reset local input date
    resetLocalInputData();

    setIsEditMode(false);
    setIsChange(false);
    if (editMode === true) onClose();
  };

  const handleExit = () => {
    setIsChange(false);
    setIsEditMode(false);

    // Reset local input date
    resetLocalInputData();

    if (editMode === true) onClose();
  };

  const handleCancel = () => {
    if (isChange) {
      Modal.confirm({
        transitionName: '',
        maskTransitionName: '',
        className: 'type-error',
        width: '22.5rem',
        icon: <InfoCircleOutlined />,
        title: '변경 사항을 저장하지 않고 나가시겠습니까?',
        okText: '나가기',
        cancelText: '취소',
        onOk: handleExit,
      });
    } else {
      handleExit();
    }
  };

  const imageChangeMenu = (
    <Menu>
      <Menu.Item>
        <StyledUpload
          component="div"
          accept={['.jpg,.jpeg,.png']}
          multiple={false}
          customRequest={({ file }) => handleChangePhoto(file)}
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
  );

  const backgroundMenu = (
    <Menu>
      <Menu.Item>
        <StyledUpload
          component="div"
          accept={['.jpg,.jpeg,.png']}
          multiple={false}
          customRequest={({ file }) => handleChangeBackground(file)}
        >
          내 PC에서 배경 변경
        </StyledUpload>
      </Menu.Item>
      {/* <DropItem>테마 이미지에서 변경</DropItem>  1월 업데이트 */}
      <Menu.Item
        disabled={isDefaultBackgroundPhotoUsed}
        onClick={handleChangeDefaultBackground}
      >
        기본 이미지로 변경
      </Menu.Item>
    </Menu>
  );

  const handleToggleFavorite = useCallback(
    async event => {
      if (event) event.stopPropagation();
      try {
        await friendStore.setFriendFavorite({
          myUserId: userStore.myProfile.id,
          friendId: userId,
          isFav: !isFav(),
        });
      } catch (e) {
        console.log(e);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [friendStore, userId, isFav],
  );

  const userContent = (
    <UserBox>
      {imageModal && (
        <ProfileImageModal
          profilePhoto={renderProfilePhoto}
          onCancel={handleImageModal}
          name={isMyId ? '나의 프로필 사진' : profile?.nick || profile?.name}
        />
      )}
      {isEditMode && (
        <Dropdown
          trigger={['click']}
          overlay={backgroundMenu}
          placement="bottomLeft"
        >
          <TopButton>
            <Blind>배경 이미지 변경</Blind>
          </TopButton>
        </Dropdown>
      )}
      <UserImage>
        <img alt="" src={renderProfilePhoto} onClick={handleImageModal} />
        {isEditMode && (
          <ImageChangeBox>
            <Dropdown
              trigger={['click']}
              overlay={imageChangeMenu}
              placement="bottomLeft"
            >
              <ImageChangeButton>
                <ChangeIcon />
                <Blind>프로필 이미지 변경</Blind>
              </ImageChangeButton>
            </Dropdown>
          </ImageChangeBox>
        )}
      </UserImage>
      <UserInfo>
        <UserName>
          {isEditMode ? (
            <EditNameInput
              maxLength={20}
              placeholder="별명을 입력해주세요."
              value={name !== undefined ? name : profile?.nick || profile?.name}
              onChange={e => {
                setName(e);
                setIsChange(true);
              }}
            />
          ) : (
            <p>{profile?.nick || profile?.name}</p>
          )}
        </UserName>
        {!isEditMode && <UserMail>{`(${profile?.loginId})`}</UserMail>}
        {/* <UserStatus>
          {isEditMode ? (
            <EditStatusInput
              maxLength={50}
              value={
                statusMsg !== undefined ? statusMsg : profile?.profileStatusMsg
              }
              onChange={e => {
                setStatusMsg(e);
                setIsChange(true);
              }}
            />
          ) : (
              <span>{profile?.profileStatusMsg}</span>
            )}
        </UserStatus> */}
      </UserInfo>
      <UserInfoList>
        {userType === 'USR0001' && (
          <UserInfoItem>
            <UserInfoIcon iconimg="address" />
            {profile?.fullCompanyJob}
            {isEditMode && (
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
          </UserInfoItem>
        )}
        {userType === 'USR0001' && (
          <UserInfoItem>
            <UserInfoIcon iconimg="company" />
            {isEditMode ? (
              <EditNumInputBox>
                <Input
                  value={
                    phone !== undefined ? phone : profile?.companyNum || ``
                  }
                  onChange={e => {
                    setPhone(e.target.value);
                    setIsChange(true);
                  }}
                />
              </EditNumInputBox>
            ) : profile?.companyNum ? (
              `${profile?.nationalCode} ${profile?.companyNum}`
            ) : (
              `-`
            )}
          </UserInfoItem>
        )}
        <UserInfoItem>
          <UserInfoIcon iconimg="phone" />
          {isEditMode ? (
            <EditNumInputBox>
              <Input
                value={mobile !== undefined ? mobile : profile?.phone || ``}
                onChange={e => {
                  setMobile(e.target.value);
                  setIsChange(true);
                }}
              />
            </EditNumInputBox>
          ) : profile?.phone ? (
            `${profile?.nationalCode} ${profile?.phone}`
          ) : (
            `-`
          )}
          {/* 1월 업데이트 사항으로 추가 */}
          {/* {isEditMode ? (
            <EditNotic>
              휴대폰 번호는 <strong>계정 정보 변경</strong>에서 변경하세요.
            </EditNotic>
          ) : (
            <>
              <UserInfoIcon iconimg="phone" /> {profile?.departmentCode}{' '}
              {profile?.phone || `-`}
            </>
          )} */}
        </UserInfoItem>
        {/* {userType === 'USR0001' && (
          <UserInfoItem>
            <UserInfoIcon iconimg="email" />
            {profile?.email}
          </UserInfoItem>
        )} */}
      </UserInfoList>
    </UserBox>
  );

  return useObserver(() => (
    <ProfileModal
      visible={visible}
      width={editMode ? '17rem' : '17.5rem'}
      type="user"
      userContent={userContent}
      topButton
      isMyId={isMyId}
      isEditMode={isEditMode}
      onCancel={handleCloseModal}
      toggleFav={handleToggleFavorite}
      checkFav={isFav}
      userId={userId}
      isNotMyFriend={isNotMyFriend}
      footer={
        <UtilButtonBox>
          {isEditMode ? (
            <>
              <EditButton
                type="solid"
                shape="round"
                disabled={!isChange || !isValidInputData()}
                onClick={handleConfirm}
              >
                저장
              </EditButton>
              <EditButton type="system" shape="round" onClick={handleCancel}>
                취소
              </EditButton>
            </>
          ) : (
            !isNotMyFriend() && (
              <>
                <UtilButton onClick={handleClickTalk}>
                  <UtilIcon iconimg="friends" />
                  <UtilText>{isMyId ? `나와의 Talk` : `1:1 Talk`}</UtilText>
                </UtilButton>
                {isMyId ? (
                  <UtilButton onClick={handleClickEdit}>
                    <UtilIcon iconimg="profile" />
                    <UtilText>프로필 편집</UtilText>
                  </UtilButton>
                ) : (
                  <UtilButton onClick={handleClickMeeting}>
                    <UtilIcon iconimg="meeting" />
                    <UtilText>1:1 Meeting</UtilText>
                  </UtilButton>
                )}
              </>
            )
          )}
          {isNotMyFriend() && (
            <UtilButton onClick={handleAddFriend}>
              <UtilIcon iconimg="friendAdd" />
              <UtilText>프렌즈 추가</UtilText>
            </UtilButton>
          )}
        </UtilButtonBox>
      }
      style={
        editMode
          ? { top: '2.875rem', margin: '0 20px 0 auto' }
          : {
              margin: 'unset',
              top: position?.top,
              left: position?.left,
            }
      }
    />
  ));
}

const UserBox = styled.div`
  padding: 1.06rem 1.25rem 2.06rem;
`;
const TopButton = styled.button`
  position: absolute;
  top: 0.25rem;
  left: 0.25rem;
  width: 2rem;
  height: 2rem;
  background-color: transparent;
  border-radius: 50%;
  border: 0;
  cursor: pointer;
  background: rgba(000, 000, 000, 0.8) url(${photoIcon}) no-repeat 50% 50%;
  background-size: 0.88rem 0.88rem;
  &:hover {
    background-color: rgba(255, 255, 255, 0.3);
  }
  &:active,
  &:focus {
    background-color: rgba(90, 95, 255, 0.8);
  }
`;
const Blind = styled.span`
  position: absolute;
  clip: rect(0 0 0 0);
  width: 1px;
  height: 1px;
  margin: -1px;
  overflow: hidden;
`;
const UserImage = styled.div`
  position: relative;
  margin: 0 auto;
  width: 6.25rem;
  height: 6.25rem;
  border-radius: 50%;
  cursor: pointer;
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }
`;
const ImageChangeBox = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  background-color: #0b1d41;
  border: 0.25rem solid #0b1d41;
  border-radius: 50%;
`;

const StyledUpload = styled(Upload)`
  &:focus {
    outline: 0;
  }
`;

const ImageChangeButton = styled.button`
  width: 2rem;
  height: 2rem;
  background: #000;
  border-radius: 50%;
  line-height: 0;
  border: 0;
  cursor: pointer;
  &:hover {
    background-color: rgba(255, 255, 255, 0.3);
  }
  &:active,
  &:focus {
    background-color: rgba(90, 95, 255, 0.8);
  }
`;
const ChangeIcon = styled.span`
  display: inline-block;
  width: 1rem;
  height: 1rem;
  background-image: url(${tsCameraImgIcon});
  background-repeat: no-repeat;
  background-size: 1rem 1rem;
`;
const UserInfo = styled.div`
  min-height: 4.32rem;
`;
const UserName = styled.div`
  margin-top: 0.19rem;
  font-size: 0.94rem;
  line-height: 1.38rem;
  p {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;
const UserMail = styled.span`
  overflow: hidden;
  display: block;
  margin-top: 0.25rem;
  font-size: 0.69rem;
  line-height: 1.06rem;
  opacity: 0.8;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
// eslint-disable-next-line no-unused-vars
const UserStatus = styled.div`
  margin-top: 0.5rem;
  opacity: 0.8;
  span {
    font-size: 0.75rem;
    line-height: 1.13rem;
  }
`;
const UtilButtonBox = styled.div`
  display: flex;
  min-height: 5.63rem;
  align-items: flex-end;
  justify-content: center;
  padding: 1.44rem 1.06rem 1.5rem;
`;
const UtilButton = styled.button`
  width: 4.75rem;
  border: none;
  border-radius: 0.63rem;
  font-size: 0.69rem;
  line-height: 1.06rem;
  background-color: transparent;
  color: #333;
  cursor: pointer;
`;
const EditButton = styled(Button)`
  & + & {
    margin-left: 0.5rem;
  }
`;
const UserInfoList = styled.ul`
  margin-top: 1.13rem;
`;
const UserInfoItem = styled.li`
  display: flex;
  margin-top: 0.44rem;
  font-size: 0.75rem;
  line-height: 1.13rem;
  color: rgba(255, 255, 255, 0.9);
  word-break: break-all;
  word-wrap: break-word;
  text-align: left;
  &:first-of-type {
    margin-top: 0;
  }
`;
// eslint-disable-next-line no-unused-vars
const EditNotic = styled.p`
  width: 100%;
  text-align: center;
  color: rgba(255, 255, 255, 0.49);
  strong {
    color: #6c56e5;
    text-decoration: underline;
  }
`;
const UserInfoIcon = styled.span`
  width: 1rem;
  height: 1rem;
  margin: 0.1875rem 0.63rem 0 0;
  background-repeat: no-repeat;
  background-size: 1rem 1rem;
  flex-shrink: 0;
  opacity: 0.9;
  ${props => {
    switch (props.iconimg) {
      case 'address':
      default:
        return css`
          background-image: url(${tsOfficeIcon});
        `;
      case 'company':
        return css`
          background-image: url(${tsCallIcon});
        `;
      case 'phone':
        return css`
          background-image: url(${tsPhoneIcon});
        `;
      case 'email':
        return css`
          background-image: url(${tsMailIcon});
        `;
    }
  }}
`;
const EditNameInput = styled(InputCounter)`
  flex-direction: column;
  height: auto;
  margin-top: 0.25rem;
  padding: 0;
  border: 0 !important;
  border-radius: 0;
  background-color: transparent;
  &:not(:disabled):focus-within {
    input {
      border-color: #6c56e5;
    }
  }
  input {
    height: 1.875rem;
    margin: 0;
    padding-bottom: 0.25rem;
    border-bottom: 1px solid #fff;
    font-size: 0.94rem;
    text-align: center;
  }
  .input-counter {
    font-size: 0.69rem;
    line-height: 1.06rem;
    color: #fff;
    opacity: 0.7;
  }
`;
// eslint-disable-next-line no-unused-vars
const EditStatusInput = styled(EditNameInput)`
  margin-top: 0;
  padding: 0 0 0.31rem;
  input {
    height: 1.13rem;
    font-size: 0.75rem;
  }
`;
const EditNumInputBox = styled.span`
  display: flex;
  width: 100%;
  margin-bottom: 0.2rem;
  padding-bottom: 0.13rem;
  .ant-input {
    padding: 0;
    background-color: transparent !important;
    border-radius: 0;
    border-width: 0 0 1px !important;
    color: #fff !important;
  }
`;
const UtilIcon = styled.span`
  display: inline-block;
  width: 1.5rem;
  height: 1.5rem;
  margin-bottom: 0.25rem;
  background-repeat: no-repeat;
  background-size: 1.5rem 1.5rem;
  ${props => {
    switch (props.iconimg) {
      case 'friends':
      default:
        return css`
          background-image: url(${talkIconB});
        `;
      case 'profile':
        return css`
          background-image: url(${editIcon});
        `;
      case 'meeting':
        return css`
          background-image: url(${teeMeetingIconB});
        `;
      case 'friendAdd':
        return css`
          background-image: url(${addIcon});
        `;
    }
  }}
`;
const UtilText = styled.p`
  padding-top: 0.06rem;
  font-size: 0.69rem;
  line-height: 1.06rem;
  color: #333;
`;
const LockIconBox = styled.span`
  margin: auto 0;
  padding-left: 0.3125rem;
  font-size: 0.88rem;
  color: #75757f;
`;

export default ProfileInfoModal;
