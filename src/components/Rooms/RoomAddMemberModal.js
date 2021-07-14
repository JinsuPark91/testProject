import React, { useState, useEffect, useCallback } from 'react';
import { Button } from 'antd';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { useCoreStores, ItemSelector, Modal } from 'teespace-core';
import { useStores } from '../../stores';

function RoomAddMemberModal({
  visible = false,
  roomId,
  onInviteUsers = () => {},
  onCancel = () => {},
}) {
  const { t } = useTranslation();
  const [isLoaded, setisLoaded] = useState(false);
  const [members, setMembers] = useState([]);
  const [blockedMembers, setBlockedMembers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const { roomStore, userStore } = useCoreStores();
  const { uiStore, roomSettingStore } = useStores();

  useEffect(() => {
    if (roomId && visible) {
      const myUserId = userStore.myProfile.id;

      Promise.all([
        roomStore.fetchRoomMemberList({ myUserId, roomId }),
        roomStore.getBanList({
          roomId,
        }),
      ]).then(([roomMembers, banInfos]) => {
        const userIdList = banInfos.map(({ userId }) => userId);
        userStore.fetchProfileList(userIdList).then(blockMembers => {
          setMembers(roomMembers);
          setBlockedMembers(blockMembers || []);
          setisLoaded(true);
        });
      });
    } else {
      setisLoaded(false);
    }
  }, [roomStore, userStore, roomId, visible]);

  const handleSelectedUserChange = useCallback(
    ({ userArray }) => {
      const originRoomMemberIds = members.map(
        member => member.friendId || member.id,
      );

      const blockedMemberIds = blockedMembers.map(member => member.id);
      const mergedMemberIds = [
        ...new Set(originRoomMemberIds.concat(blockedMemberIds)),
      ];

      const filteredUsers = userArray.filter(
        user => !mergedMemberIds.includes(user.friendId || user.id),
      );
      setSelectedUsers(filteredUsers);
    },
    [members, blockedMembers],
  );

  const handleInviteUsers = async () => {
    const myUserId = userStore.myProfile.id;
    const roomInfo = roomStore.getRoom(roomId);

    try {
      // 내가 관리자가 아닌 입장 제한 오픈 룸은 입장 요청
      if (
        roomInfo.type === 'WKS0003' &&
        !roomInfo.isJoinable &&
        roomInfo.adminId !== myUserId
      ) {
        const userIdList = selectedUsers.map(user => user.friendId || user.id);
        await roomStore.requestEnterRoom({
          roomId,
          userIdList,
        });
        uiStore.openToast({
          text: t('CM_ROOM_INVITE_BLOCK_ROOM_TOOLTIP', {
            num: userIdList.length,
          }),
          onClose: () => uiStore.closeToast(),
        });
        onCancel();
      } else {
        const {
          result,
          roomId: resultRoomId,
        } = await roomStore.inviteNewMembers({
          myUserId,
          roomId,
          newMemberList: selectedUsers.map(user => ({
            userId: user.friendId || user.id,
          })),
        });

        if (!result) throw Error('[Platform] Invite Member failed.');
        onInviteUsers(selectedUsers, resultRoomId);

        // 내가 어드민인 오픈 룸에서는 입장 대기 멤버 최신화
        if (roomInfo.type === 'WKS0003' && roomInfo.adminId === myUserId)
          roomSettingStore.fetchRequestMembers({ roomId });
      }
    } catch (e) {
      console.error('[Platform] Invite Member Error : ', e);
    }
  };

  const handleCancel = () => onCancel();

  const getDisabledIds = () => {
    const originMemberIds = members.map(member => member.friendId || member.id);
    const blockedMemberIds = blockedMembers.map(member => member.id);
    return [...new Set(originMemberIds.concat(blockedMemberIds))];
  };

  const getBlockedMemberIds = () => {
    const blockedMemberIds = blockedMembers.map(member => member.id);
    return blockedMemberIds;
  };

  const getDefaultSelectedUsers = () => {
    return members.concat(blockedMembers);
  };

  return (
    isLoaded && (
      <Modal
        title={t('CM_ROOM_INVITE_USER')}
        visible={visible}
        closable
        onCancel={handleCancel}
        footer={null}
        destroyOnClose
      >
        <ItemSelector
          isVisibleRoom={false}
          onSelectChange={handleSelectedUserChange}
          disabledIds={getDisabledIds()}
          defaultSelectedUsers={getDefaultSelectedUsers()}
          showMeOnFriendTab={false}
          height={25} // rem
          blockedMembers={getBlockedMemberIds()}
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
            {`${t('CM_B2B_CREATE_ROOM_POPUP_FRIENDS_09')} ${
              selectedUsers.length > 99 ? '99+' : selectedUsers.length
            }`}
          </Button>
          <Button
            type="outlined"
            size="default"
            shape="round"
            onClick={handleCancel}
          >
            {t('CM_CANCEL')}
          </Button>
        </ButtonContainer>
      </Modal>
    )
  );
}

const ButtonContainer = styled.div`
  display: flex;
  padding: 1.06rem 0;
  align-items: center;
  justify-content: center;
  border-top: 1px solid ${props => props.theme.LineMain};
`;

export default RoomAddMemberModal;
