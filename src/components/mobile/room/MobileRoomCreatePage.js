import React from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MobileItemSelector, useCoreStores } from 'teespace-core';

const MobileRoomCreatePage = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const { userStore, roomStore } = useCoreStores();

  const myUserId = userStore.myProfile.id;

  const handleCancel = () => history.push(`/room`);

  const handleCreate = async selectedUsers => {
    if (selectedUsers.length === 0) return;

    const userList = selectedUsers.map(elem => ({
      userId: elem.friendId || elem.id,
    }));

    const { roomId } = await roomStore.createRoom({
      creatorId: myUserId,
      userList,
      type: 'private',
      language: userStore.myProfile.language,
    });
    const checkRoom = roomStore.getRoomMap().get(roomId);

    if (checkRoom && !checkRoom.isVisible) {
      await roomStore.activateRoom({
        roomId,
      });
    }
    history.push(`/talk/${roomId}`);
  };

  return (
    <MobileItemSelector
      visible
      title={t('CM_CREATE_PRIVATE_ROOM_02')}
      onOk={handleCreate}
      okText={t('CM_B2B_CREATE_ROOM_POPUP_FRIENDS_09')}
      onCancel={handleCancel}
      disabledIds={[userStore.myProfile.id]}
      showMeOnFriendTab={false}
      useFriends
    />
  );
};

export default MobileRoomCreatePage;
