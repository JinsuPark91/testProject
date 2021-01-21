import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { Observer } from 'mobx-react';
import styled, { css } from 'styled-components';
import { Button } from 'antd';
import { useCoreStores, ProfileInfoModal } from 'teespace-core';
import ProfileModal from '../profile/ProfileModal';
import Photos from '../Photos';
import Input from '../Input';
import AddIcon from '../../assets/ts_friends_add.svg';
import TalkIcon from '../../assets/ts_TeeTalk.svg';
import MeetingIcon from '../../assets/ts_TeeMeeting.svg';
import EditIcon from '../../assets/edit_white.svg';
// import ProfileInfoModal from '../profile/ProfileInfoModal';
import RoomAddMemberModal from './RoomAddMemberModal';
import { getQueryString, getQueryParams } from '../../utils/UrlUtil';

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
  &:before {
    content: '';
    display: inline-block;
    width: 1.5rem;
    height: 1.5rem;
    margin-right: 0.38rem;
    background: url(${AddIcon}) no-repeat 50% 50%;
    background-size: contain;
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
    background-color: #344360;
  }
  &:active,
  &:focus {
    background-color: #081734;
  }
  & + & {
    margin-left: 0.5625rem;
  }
`;
const ButtonIcon = styled.span`
  display: block;
  width: 1.5rem;
  height: 1.5rem;
  margin: 0 auto 0.13rem;
  background-repeat: no-repeat;
  background-size: 1.5rem 1.5rem;
  ${props => {
    switch (props.iconimg) {
      case 'name':
        return css`
          background-image: url(${EditIcon});
        `;
      case 'talk':
        return css`
          background-image: url(${TalkIcon});
        `;
      case 'Meeting':
        return css`
          background-image: url(${MeetingIcon});
        `;
    }
  }}
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
    const queryParams = { ...getQueryParams(), sub: 'meeting' };
    const queryString = getQueryString(queryParams);
    history.push(`/s/${roomInfo.id}/talk?${queryString}`);
    onCancel(e);
  };

  const handleEdit = () => {
    setIsEditMode(true);
  };

  const handleChangeNameOK = async () => {
    setIsEditMode(false);
    const res = await updateRoomSetting({ newRoomCustomName: roomName });
    console.log('RES : ', res);
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

  const handleClickProfileMeeting = useCallback(() => {
    setIsProfileModalVisible(false);
    // NOTE. 프로파일 다이얼로그 닫힌 다음 룸 정보 다이얼로그를 닫게 하기 위해 이벤트 시차를 둠.
    setTimeout(() => {
      onCancel();
    }, 0);
  }, [onCancel]);

  const userContent = (
    <>
      <StyledPhotos srcList={memberPhotos} defaultDiameter="3.75" />

      <Observer>
        {() => (
          <GroupTitle>
            {isEditMode ? (
              <StyledInput
                maxLength={20}
                value={roomName}
                onChange={handleChange}
                ref={nameInputRef}
                placeholder={roomInfo?.customName || roomInfo?.name}
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

      <GroupNumber>{roomInfo?.userCount}명</GroupNumber>
      <SettingBox>
        {isEditMode ? (
          <>
            <Button
              type="solid"
              shape="round"
              onClick={handleChangeNameOK}
              disabled={!isChanged}
            >
              저장
            </Button>
            <Button
              type="outlined"
              shape="round"
              onClick={handleChangeNameCancel}
            >
              취소
            </Button>
          </>
        ) : (
          <>
            <SettingButton onClick={handleEdit}>
              <ButtonIcon iconimg="name" />
              이름 변경
            </SettingButton>
            <SettingButton onClick={handleTalk}>
              <ButtonIcon iconimg="talk" />
              Talk
            </SettingButton>
            <SettingButton onClick={handleMeeting}>
              <ButtonIcon iconimg="Meeting" />
              Meeting
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
            <UserName>{memberInfo.name}</UserName>
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
        footer={<AddButton onClick={handleInvite}>룸 구성원 초대</AddButton>}
      />
      {
        // NOTE. 룸 정보가 제대로 존재해야하기 때문에 visible 상태를 보고 모달을 렌더하도록 함.
        userSelectDialogVisible && (
          <RoomAddMemberModal
            visible={userSelectDialogVisible}
            roomId={roomInfo.id}
            roomMembers={members}
            onInviteUsers={handleInviteUsers}
            onCancel={handleCancelInviteUsers}
          />
        )
      }
    </>
  );
}

export default RoomInquiryModal;
