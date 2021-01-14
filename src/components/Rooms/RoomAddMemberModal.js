import React, { useState, useEffect, useCallback } from 'react';
import { Button, Modal } from 'antd';
import styled from 'styled-components';

import { useCoreStores, ItemSelector } from 'teespace-core';

function RoomAddMemberModal({
  visible = false,
  roomId,
  roomMembers,
  onInviteUsers = () => {},
  onCancel = () => {},
}) {
  const [members, setMembers] = useState(roomMembers || []);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const { roomStore, userStore } = useCoreStores();

  useEffect(() => {
    if (!roomMembers && roomId && visible) {
      const myUserId = userStore.myProfile.id;
      roomStore
        .fetchRoomMemberList({ myUserId, roomId })
        .then(roomMembers0 => setMembers(roomMembers0));
    }
  }, [roomMembers, roomId, visible, roomStore, userStore]);

  const handleSelectedUserChange = useCallback(
    ({ userArray }) => {
      const originRoomMemberIds = members.map(
        member => member.friendId || member.id,
      );
      const filteredUsers = userArray.filter(
        user => !originRoomMemberIds.includes(user.friendId || user.id),
      );
      console.log('Filtered Users : ', filteredUsers);
      setSelectedUsers(filteredUsers);
    },
    [members],
  );

  const handleInviteUsers = async () => {
    const myUserId = userStore.myProfile.id;

    try {
      const { result, roomId: resultRoomId } = await roomStore.inviteNewMembers(
        {
          myUserId,
          roomId,
          newMemberList: selectedUsers.map(user => ({
            userId: user.friendId || user.id,
          })),
        },
      );

      if (!result) {
        throw Error('[Platform] Invite Member failed.');
      }

      onInviteUsers(selectedUsers, resultRoomId);
    } catch (e) {
      console.error('[Platform] Invite Member Error : ', e);
    }
  };

  const handleCancel = () => {
    onCancel();
  };

  return (
    <FlexModal
      title={
        <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>
          룸 구성원 초대
        </div>
      }
      visible={visible}
      closable
      onCancel={handleCancel}
      footer={null}
      destroyOnClose
    >
      <ItemSelector
        isVisibleRoom={false}
        onSelectChange={handleSelectedUserChange}
        disabledIds={members.map(member => member.friendId || member.id)}
        defaultSelectedUsers={members}
        showMeOnFriendTab={false}
        height={25} // rem
      />
      <ButtonContainer>
        <Button
          type="solid"
          size="default"
          shape="round"
          onClick={handleInviteUsers}
          style={{ marginRight: '0.38rem' }}
          disabled={selectedUsers.length <= 0}
        >
          {`초대 ${selectedUsers.length > 99 ? '99+' : selectedUsers.length}`}
        </Button>
        <Button
          type="outlined"
          size="default"
          shape="round"
          onClick={handleCancel}
        >
          취소
        </Button>
      </ButtonContainer>
    </FlexModal>
  );
}

const FlexModal = styled(Modal)`
  font-size: 16px;
  display: flex;
  justify-content: center;

  & .ant-modal-header {
    border-bottom: 1px solid #e3e7eb;
  }

  & .ant-modal-body {
    padding: 0;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  padding: 1.06rem 0;
  align-items: center;
  justify-content: center;
  border-top: 1px solid #e3e7eb;
`;

export default RoomAddMemberModal;
