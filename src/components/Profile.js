import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Upload from 'rc-upload';
import styled, { css } from 'styled-components';
import { Button, Input, Dropdown, Menu, Modal } from 'antd';
import { useCoreStores, profileStatusMsg, Message } from 'teespace-core';
import friendsIcon from '../assets/ts_friends.svg';
import profileEditIcon from '../assets/ts_profile_edit.svg';
import teeMeetingIcon from '../assets/ts_TeeMeeting.svg';
import tsOfficeIcon from '../assets/ts_office.svg';
import tsCallIcon from '../assets/ts_call.svg';
import tsPhoneIcon from '../assets/ts_phone.svg';
import tsMailIcon from '../assets/ts_mail.svg';
import EmailHoverIcon from '../assets/ts_export.svg';
import tsBgImgIcon from '../assets/ts_photo.svg';
import tsCameraImgIcon from '../assets/ts_camera.svg';

const IS_LOCAL = true;

const Profile = ({
  userId = null,
  editMode = false,
  showSider = true,
  onModeChange = null,
}) => {
  const history = useHistory();
  const { roomStore, userStore } = useCoreStores();
  const [isEditMode, setEditMode] = useState(editMode);
  const [profile, setProfile] = useState(null);
  // 유저 정보들
  const [background, setBackground] = useState(null);
  const [thumb, setThumb] = useState(null);
  const [phone, setPhone] = useState('');
  const [mobile, setMobile] = useState('');
  const [isChange, setIsChange] = useState(false);
  const [name, setName] = useState('');
  const [profileStatusMsg, setStatusMsg] = useState('');
  const [cancelDialogVisible, setCancelDialogVisible] = useState(false);

  const isMyId = () => userId === userStore.myProfile.id;

  const getBackPhoto = backPhoto => {
    return userStore.getUserBackPhoto({
      userId,
      size: 'medium',
      isLocal: IS_LOCAL,
      backPhoto: backPhoto || null,
    });
  };

  const getThumbPhoto = thumbPhoto => {
    return userStore.getUserProfilePhoto({
      userId,
      size: 'medium',
      isLocal: IS_LOCAL,
      thumbPhoto: thumbPhoto || null,
    });
  };

  useEffect(() => {
    setEditMode(editMode);
    (async () => {
      const userProfile = await userStore.getProfile({ userId });
      setProfile(userProfile);
      setPhone(userProfile?.companyNum);
      setMobile(userProfile?.phone);
      setName(userProfile?.name);

      setThumb(`${getThumbPhoto()}`);
      setBackground(`${getBackPhoto()}`);
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
  };

  const handleMeetingClick = () => {
    console.log('1 : 1 미팅');
  };

  const handleChangeBackground = file => {
    setIsChange(true);
    setBackground(URL.createObjectURL(file));
  };

  const handleChangePhoto = file => {
    setIsChange(true);
    // const thumbPhoto = ;
    // console.log('CHANGE PHOTO : ', thumbPhoto);
    setThumb(URL.createObjectURL(file));
  };

  const handleChangeDefaultBackground = () => {
    setIsChange(true);
    setBackground(`${getBackPhoto()}`);
  };

  const handleChangeDefaultPhoto = () => {
    setIsChange(true);
    setThumb(`${getThumbPhoto()}`);
  };

  const handleConfirm = async () => {
    // const blobImages = await Promise.all([toBlob(background), toBlob(thumb)]);
    // const base64Images = await Promise.all(
    //   blobImages.map(blobImage => toBase64(blobImage)),
    // );
    console.log('BACK PHOTO : ', background);
    console.log('THUMB PHOTO : ', thumb);

    const updatedInfo = {
      companyNum: phone,
      phone: mobile,
    };

    if (thumb.includes('blob:')) {
      const blobImage = await toBlob(thumb);
      const base64Image = await toBase64(blobImage);
      updatedInfo.profilePhoto = base64Image;

      URL.revokeObjectURL(thumb);
    }

    if (background.includes('blob:')) {
      const blobImage = await toBlob(background);
      const base64Image = await toBase64(blobImage);
      updatedInfo.backPhoto = base64Image;

      URL.revokeObjectURL(background);
    }

    console.log('updated Info : ', updatedInfo);
    const updatedProfile = await userStore.updateMyProfile({ updatedInfo });

    console.log('UPDATED!!!!!!!!!!!!! : ', updatedProfile);
    setPhone(updatedProfile?.companyNum);
    setMobile(updatedProfile?.phone);

    setEditMode(false);
    setIsChange(false);
  };

  const handleExit = () => {
    setIsChange(false);
    setEditMode(false);

    setMobile(profile?.phone);
    setPhone(profile?.companyNum);
    setBackground(getBackPhoto());
    setThumb(getThumbPhoto());
    setCancelDialogVisible(false);
  };
  const handleExitCancel = () => {
    setCancelDialogVisible(false);
  };

  const handleCancel = () => {
    setCancelDialogVisible(true);
  };

  const handleTalkClick = async () => {
    try {
      const myUserId = userStore.myProfile.id;
      const response = await roomStore.getDMRoom(myUserId, userId);

      // DM 룸이 이미 있으면, visible 상태로 만들어 준다.
      const dmRoom = roomStore.getRoomMap().get(response.roomId);
      if (!dmRoom.isVisible) {
        await roomStore.updateRoomMemberSetting({
          roomId: dmRoom.id,
          myUserId,
          newIsVisible: true,
        });
      }

      if (!response.result) {
        throw Error('DM ROOM GET FAILED');
      }
      history.push(`/s/${response.roomId}/talk`);
    } catch (e) {
      console.error(`Error is${e}`);
    }
  };

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
      <Wrapper imageSrc={background}>
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
          {isEditMode && (
            <Dropdown
              trigger={['click']}
              overlay={
                <Menu>
                  <Menu.Item>
                    <StyledUpload
                      component="div"
                      accept={['image/*']}
                      multiple={false}
                      customRequest={({ file }) => handleChangeBackground(file)}
                    >
                      배경 변경
                    </StyledUpload>
                  </Menu.Item>

                  <Menu.Item onClick={handleChangeDefaultBackground}>
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
          <UserImageWrapper position="br">
            <UserImage src={thumb} />
            {isMyId() && isEditMode && (
              <Dropdown
                trigger={['click']}
                overlay={
                  <Menu>
                    <Menu.Item>
                      <StyledUpload
                        component="div"
                        multiple={false}
                        accept={['image/*']}
                        customRequest={({ file }) => handleChangePhoto(file)}
                      >
                        프로필 사진 변경
                      </StyledUpload>
                    </Menu.Item>
                    <Menu.Item onClick={handleChangeDefaultPhoto}>
                      기본 이미지로 변경
                    </Menu.Item>
                  </Menu>
                }
              >
                <ImageChangeButton position="br">
                  <StyleCameraImgIcon />
                </ImageChangeButton>
              </Dropdown>
            )}
          </UserImageWrapper>
          <BigText>
            {isEditMode ? (
              <StyleInput
                className="type2"
                onChange={e => {
                  setIsChange(true);
                  setName(e.target.value);
                }}
                value={name}
              />
            ) : (
              name
            )}
          </BigText>
          <UserEmailText>{`(${profile?.loginId}@tmax.teepsace.net)`}</UserEmailText>
          <UserStatusMsg>
            {isEditMode ? (
              <StyleInput
                className="type2"
                onChange={e => {
                  setIsChange(true);
                  setStatusMsg(e.target.value);
                }}
                value={profileStatusMsg}
              />
            ) : (
              profileStatusMsg
            )}
          </UserStatusMsg>
          <UserInfoList>
            <UserInfoItem>
              <StyleOfficeIcon iconimg="address" />
              <StylText>{profile?.fullCompanyJob}</StylText>
            </UserInfoItem>
            <UserInfoItem>
              <StyleOfficeIcon iconimg="company" />
              {isEditMode ? (
                <StyleInput
                  onChange={e => {
                    setIsChange(true);
                    setMobile(e.target.value);
                  }}
                  value={mobile}
                />
              ) : (
                <StylText>{mobile}</StylText>
              )}
            </UserInfoItem>
            <UserInfoItem>
              <StyleOfficeIcon iconimg="phone" />
              {isEditMode ? (
                <StyleInput
                  onChange={e => {
                    setIsChange(true);
                    setPhone(e.target.value);
                  }}
                  value={phone}
                />
              ) : (
                <StylText>{phone}</StylText>
              )}
            </UserInfoItem>
            {/* 프로필 편집 시 "email" class 삭제 */}
            <UserInfoItem
              className={isEditMode ? '' : 'email'}
              onClick={() => {
                console.log('todo');
              }}
            >
              <StyleOfficeIcon iconimg="email" />
              <StyleOfficeIcon iconimg="emailhover" />
              <StylText>{profile?.email}</StylText>
            </UserInfoItem>
          </UserInfoList>
          <ButtonContainer>
            {isEditMode && (
              <>
                <Button
                  style={{ marginRight: '1.25rem' }}
                  type="solid"
                  shape="round"
                  disabled={!isChange}
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
        </Content>
      </Wrapper>
    </>
  );
};

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
  display: flex;
  align-items: center;
  color: #fff;
  font-size: 0.81rem;
  font-weight: 600;
`;

const UserEmailText = styled(Text)`
  display: flex;
  align-items: center;
  margin-top: 0.5rem;
  line-height: 1.25rem;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.875rem;
  font-weight: 600;
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
  display: flex;
  position: relative;
  width: 100%;
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
  width: 7.5rem;
  height: 7.5rem;
  background: #fff;
  border-radius: 50%;
`;
const UserImage = styled.img`
  width: 6.88rem;
  height: 6.88rem;
  border-radius: 50%;
`;

const UserInfoList = styled.div`
  min-width: 300px;
  display: flex;
  flex-direction: column;
`;

const UserInfoItem = styled.div`
  display: flex;
  align-items: center;
  margin-top: 0.88rem;
  &:first-of-type {
    margin-top: 4.38rem;
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
`;
const BigText = styled(Text)`
  margin-top: 0.88rem;
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
  width: 2.75rem;
  height: 2.75rem;
  background-image: url(${friendsIcon});
  background-repeat: no-repeat;
  background-size: 2.75rem 2.75rem;
`;

const StyleIcon = styled.span`
  display: inline-block;
  width: 2.13rem;
  height: 2.13rem;
  margin-bottom: 0.25rem;
  background-repeat: no-repeat;
  background-size: 2.13rem 2.13rem;
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

const StylText = styled(Text)`
  display: inline-block;
  width: 12.19rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  align-items: center;
  color: #fff;
  line-height: 1.25rem;
  font-size: 0.88rem;
  font-weight: 600;
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

      case 'emailhover':
        return css`
          background-image: url(${EmailHoverIcon});
        `;
    }
  }}
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

const StyleCameraImgIcon = styled.span`
  width: 1rem;
  height: 1rem;
  background-image: url(${tsCameraImgIcon});
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

export default Profile;
