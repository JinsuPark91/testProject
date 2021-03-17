import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { Observer } from 'mobx-react';
import styled from 'styled-components';
import { Button } from 'antd';
import { useCoreStores, ProfileInfoModal, ProfileModal } from 'teespace-core';
import { useTranslation } from 'react-i18next';
import Photos from '../Photos';
import Input from '../Input';
import RoomAddMemberModal from './RoomAddMemberModal';
import { getQueryString, getQueryParams } from '../../utils/UrlUtil';
import PlatformUIStore from '../../stores/PlatformUIStore';
import { AddAcountIcon, ChattingIcon, EditIcon, MeetingIcon } from '../Icons';

const AddButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 3.13rem;
  background-color: transparent;
  border: solid #e3e7eb;
  border-width: 1px 0 0;
  font-size: 0.81rem;
  color: #3b3b3b;
  outline: none;
  cursor: pointer;

  svg {
    margin-right: 0.5rem;
  }
`;
const UserList = styled.div`
  overflow-y: auto;
  height: 13.5rem;
  padding: 0.94rem;
`;
const UserItem = styled.div`
  display: flex;
  align-items: center;
  & + & {
    margin-top: 0.63rem;
  }
`;
const UserImag = styled.div`
  position: relative;
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
  flex-shrink: 0;
  cursor: pointer;
  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border: 1px solid rgba(0, 0, 0, 0.05);
    border-radius: 50%;
  }
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
  }
`;
const UserName = styled.p`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  padding-left: 0.5rem;
  font-size: 0.75rem;
  line-height: 1.13rem;
  color: #000;
`;
const GroupTitle = styled.div`
  padding: 0.44rem 1.25rem 0;
  p {
    overflow: hidden;
    font-size: 0.94rem;
    line-height: 1.38rem;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
`;
const GroupNumber = styled.span`
  font-size: 0.81rem;
  line-height: 1.19rem;
  opacity: 0.5;
`;
const SettingBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 4.13rem;
  padding: 1.13rem 0 0.94rem;
  .ant-btn + .ant-btn {
    margin-left: 0.44rem;
  }
`;
const SettingButton = styled.button`
  width: 4.75rem;
  height: 4.13rem;
  background-color: transparent;
  border-radius: 0.63rem;
  border: 0;
  font-size: 0.69rem;
  opacity: 0.9;
  cursor: pointer;
  &:hover {
    background-color: #313a46;
  }
  &:active,
  &:focus {
    background-color: #0c1724;
  }
  & + & {
    margin-left: 0.5625rem;
  }
`;
const ButtonIcon = styled.span`
  display: block;
  margin-bottom: 0.38rem;
  line-height: 0;
`;
const StyledInput = styled(Input)`
  height: auto;
  padding: 0;
  background-color: transparent;
  border-width: 0 0 1px !important;
  border-radius: 0;
  &:hover,
  &:active,
  &:not(:disabled):focus-within {
    border-color: #fff;
  }
  input {
    font-size: 0.94rem;
  }
  .input-counter {
    font-size: 0.69rem;
    color: #bdc6d3;
  }
`;

const StyledPhotos = styled(Photos)`
  margin: 0 auto;
  cursor: default;
`;

function RoomInquiryModal({
  roomId = null,
  visible = false,
  onCancel = null,
  isEdit = false,
  width = '10rem',
  top = '0',
  left = '0',
}) {
  const { t } = useTranslation();
  const history = useHistory();

  const initialStates = {
    userSelectDialogVisible: false,
    isEditMode: false,
    isChanged: false,
    roomName: '',
    roomInfo: null,
    members: [],
    memberPhotos: [],
  };

  const [userSelectDialogVisible, setUserSelectDialogVisible] = useState(
    initialStates.userSelectDialogVisible,
  );

  const [isEditMode, setIsEditMode] = useState(initialStates.isEditMode);
  const [roomName, setRoomName] = useState(initialStates.roomName);
  const [roomInfo, setRoomInfo] = useState(initialStates.roomInfo);
  const [isChanged, setIsChanged] = useState(initialStates.isChanged);
  const [members, setMembers] = useState(initialStates.members);
  const [memberPhotos, setMemberPhotos] = useState(initialStates.memberPhotos);
  const [isProfileModalVisible, setIsProfileModalVisible] = useState(false);
  const [profileUserId, setProfileUserId] = useState();
  const { roomStore, userStore } = useCoreStores();
  const nameInputRef = useRef();

  const getUserPhotos = _roomInfo => {
    if (_roomInfo && _roomInfo?.memberIdListString) {
      return _roomInfo.memberIdListString
        .split(',')
        .splice(0, 4)
        .map(userId => userStore.getProfilePhotoURL(userId, 'small'));
    }
    return [];
  };

  const clearState = () => {
    setIsEditMode(initialStates.isEditMode);
    setIsChanged(initialStates.isChanged);
    setRoomName(initialStates.roomName);
    setRoomInfo(initialStates.roomInfo);
    setMembers(initialStates.members);
    setMemberPhotos(initialStates.memberPhotos);
  };

  // NOTE. 다이얼로그가 보여지는 상태로 바뀌는 경우, EDIT 모드 여부를 체크해서 로컬 상태로 반영
  //  주의, 바로 아래 useEffect 보다 먼저 실행되어야 focus(), select() 가 적용됨.
  useEffect(() => {
    setIsEditMode(isEdit);
  }, [isEdit, visible]);

  useEffect(() => {
    if (roomId && visible) {
      const foundRoom = roomStore.getRoomMap().get(roomId);
      setRoomInfo(foundRoom);

      setRoomName(foundRoom.customName || foundRoom.name);
      setMemberPhotos(getUserPhotos(foundRoom));
      // NOTE. 수정 모드인 경우 기존 내용을 선택하고, 포커스 설정
      if (isEditMode && nameInputRef?.current) {
        nameInputRef.current.select();
        nameInputRef.current.focus();
      }
    } else if (!visible) {
      clearState();
    }
  }, [roomId, visible, isEditMode]);

  useEffect(() => {
    if (roomId && visible) {
      const myUserId = userStore.myProfile.id;
      roomStore
        .fetchRoomMemberList({ myUserId, roomId })
        .then(roomMembers => setMembers(roomMembers));
    }
  }, [roomId, visible]);

  const updateRoomSetting = async options => {
    try {
      const myUserId = userStore.myProfile.id;
      const result = await roomStore.updateRoomMemberSetting({
        roomId,
        myUserId,
        ...options,
      });
      return result;
    } catch (e) {
      console.log('[Platform] Room Setting failed : ', e);
    }
  };

  const handleChange = text => {
    setRoomName(text);
    setIsChanged(true);
  };

  const handleCancel = e => {
    onCancel(e);
  };

  const handleTalk = e => {
    history.push(`/s/${roomInfo.id}/talk`);
    onCancel(e);
  };
  const handleMeeting = e => {
    // const queryParams = { ...getQueryParams(), sub: 'meeting' };
    const queryString = getQueryString(getQueryParams());
    PlatformUIStore.openWindow({
      id: roomInfo.id,
      type: 'meeting',
      name: null,
      userCount: null,
      handler: null,
    });

    history.push(`/s/${roomInfo.id}/talk?${queryString}`);
    onCancel(e);
  };

  const handleEdit = () => {
    setIsEditMode(true);
  };

  const handleChangeNameOK = async () => {
    setIsEditMode(false);
    await updateRoomSetting({ newRoomCustomName: roomName });
  };

  const handleChangeNameCancel = () => {
    setIsEditMode(false);
  };

  const handleInvite = e => {
    setUserSelectDialogVisible(true);
  };

  const handleInviteUsers = async (_, resultRoomId) => {
    // 1:1 룸에 초대한 경우 새로운 룸이 생성되는데, 이 경우 그 룸으로 이동해야함.
    if (roomId !== resultRoomId) {
      history.push(`/s/${resultRoomId}/talk`);
    }

    setUserSelectDialogVisible(false);
    onCancel();
  };

  const handleCancelInviteUsers = () => {
    setUserSelectDialogVisible(false);
  };

  const handleClickProfilePhoto = useCallback((e, userId) => {
    e.stopPropagation();
    setProfileUserId(userId);
    setIsProfileModalVisible(true);
  }, []);

  const handleCloseProfileModal = useCallback(e => {
    // (X) 클릭하거나 혹은 모달 바깥쪽을 클릭해서 닫을 수 있기 때문에 e 를 체크해야함.
    if (e) e.stopPropagation();
    setIsProfileModalVisible(false);
  }, []);

  const handleClickProfileTalk = useCallback(() => {
    setIsProfileModalVisible(false);
    // NOTE. 프로파일 다이얼로그 닫힌 다음 룸 정보 다이얼로그를 닫게 하기 위해 이벤트 시차를 둠.
    setTimeout(() => {
      onCancel();
    }, 0);
  }, [onCancel]);

  const handleClickProfileMeeting = useCallback(
    _roomId => {
      PlatformUIStore.openWindow({
        id: _roomId,
        type: 'meeting',
        name: null,
        userCount: null,
        handler: null,
      });

      setIsProfileModalVisible(false);
      // NOTE. 프로파일 다이얼로그 닫힌 다음 룸 정보 다이얼로그를 닫게 하기 위해 이벤트 시차를 둠.
      setTimeout(() => {
        onCancel();
      }, 0);
    },
    [onCancel],
  );

  const userContent = (
    <>
      <StyledPhotos srcList={memberPhotos} defaultDiameter="3.75" />

      <Observer>
        {() => (
          <GroupTitle>
            {isEditMode ? (
              <StyledInput
                maxLength={50}
                value={roomName}
                onChange={handleChange}
                ref={nameInputRef}
                placeholder={roomInfo?.oriName || roomInfo?.nameByUserNames}
              />
            ) : (
              <p>
                {roomInfo?.isMyRoom
                  ? userStore.myProfile.name
                  : roomInfo?.customName || roomInfo?.name}
              </p>
            )}
          </GroupTitle>
        )}
      </Observer>

      <GroupNumber>
        {t('CM_PPL_NUMBER', { num: roomInfo?.useCount })}
      </GroupNumber>
      <SettingBox>
        {isEditMode ? (
          <>
            <Button
              type="solid"
              shape="round"
              onClick={handleChangeNameOK}
              disabled={!isChanged}
            >
              {t('CM_SAVE')}
            </Button>
            <Button
              type="outlined"
              shape="round"
              onClick={handleChangeNameCancel}
            >
              {t('CM_CANCEL')}
            </Button>
          </>
        ) : (
          <>
            <SettingButton onClick={handleEdit}>
              <ButtonIcon>
                <EditIcon width="1.5" height="1.5" />
              </ButtonIcon>
              {t('CM_CHANGE_NAME_02')}
            </SettingButton>
            <SettingButton onClick={handleTalk}>
              <ButtonIcon>
                <ChattingIcon width="1.5" height="1.5" />
              </ButtonIcon>
              {t('CM_TEMP_TALK')}
            </SettingButton>
            <SettingButton onClick={handleMeeting}>
              <ButtonIcon>
                <MeetingIcon width="1.5" height="1.5" color="#fff" />
              </ButtonIcon>
              {t('CM_B2C_CONTENTS_AREA_EMPTY_PAGE_20')}
            </SettingButton>
          </>
        )}
      </SettingBox>
    </>
  );
  const subContent = (
    <>
      <UserList>
        {members.map(memberInfo => (
          <UserItem
            key={memberInfo.id}
            onClick={e => handleClickProfilePhoto(e, memberInfo.id)}
          >
            <UserImag>
              <img
                alt=""
                src={userStore.getProfilePhotoURL(memberInfo.id, 'small')}
              />
            </UserImag>
            <UserName>{memberInfo.nick || memberInfo.name}</UserName>
          </UserItem>
        ))}
      </UserList>
      {isProfileModalVisible && (
        <ProfileInfoModal
          userId={profileUserId}
          visible={isProfileModalVisible}
          onClose={handleCloseProfileModal}
          onClickTalk={handleClickProfileTalk}
          onClickMeeting={handleClickProfileMeeting}
          position={{ top, left: `calc(${left} + 18.5rem)` }}
          profilePhoto={userStore.getProfilePhotoURL(profileUserId, 'small')}
        />
      )}
    </>
  );

  return (
    <>
      <ProfileModal
        style={{ top, left, margin: 'unset' }}
        visible={visible}
        width={width}
        footer={null}
        onCancel={handleCancel}
        topButton
        type="room"
        userContent={userContent}
        subContent={subContent}
        footer={
          <AddButton onClick={handleInvite}>
            <AddAcountIcon width="1.25" height="1.25" color="#232D3B" />
            {t('CM_ROOM_INVITE_USER')}
          </AddButton>
        }
      />

      <RoomAddMemberModal
        visible={userSelectDialogVisible}
        roomId={roomInfo?.id}
        onInviteUsers={handleInviteUsers}
        onCancel={handleCancelInviteUsers}
      />
    </>
  );
}

export default RoomInquiryModal;
