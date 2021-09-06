import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Observer, useLocalStore } from 'mobx-react';
import { MobileItemSelector, useCoreStores } from 'teespace-core';
import { useStores } from '../../../../stores';

const MobileOpenRoomCreatePage = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const { userStore, roomStore } = useCoreStores();
  const { mobileStore } = useStores();

  // 오픈 룸 옵션 선택 없이 이 화면에 들어오면 룸 목록으로 보내자
  useEffect(() => {
    if (!mobileStore.openRoomOption.roomName) history.push(`/room`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const store = useLocalStore(() => ({
    isAlone: true,
  }));

  const { myProfile } = userStore;

  const handleCreate = async selectedUsers => {
    if (selectedUsers.length === 0) return;

    const userList = selectedUsers
      .filter(elem => {
        const userId = elem.friendId || elem.id;
        return userId !== myProfile.id;
      })
      .map(elem => ({
        userId: elem.friendId || elem.id,
      }));

    const { roomId } = await roomStore.createRoom({
      name: mobileStore.openRoomOption.roomName,
      creatorId: myProfile.id,
      userList,
      type: 'open',
      isJoinable: !mobileStore.openRoomOption.secret,
      language: myProfile.language,
    });

    history.push(`/talk/${roomId}`);
    mobileStore.clearOpenRoomOption();
  };

  const handleCancel = () => history.push(`/openoption`);

  const handleSelect = res => {
    if (res?.userArray.length > 1) store.isAlone = false;
    else store.isAlone = true;
  };

  return (
    <Observer>
      {() => (
        <MobileItemSelector
          visible
          title={t('CM_ROOM_INVITE_USER')}
          onOk={handleCreate}
          okText={
            store.isAlone
              ? t('CM_CREATE_OPEN_ROOM_07')
              : t('CM_B2B_CREATE_ROOM_POPUP_FRIENDS_09')
          }
          onCancel={handleCancel}
          onSelectChange={handleSelect}
          defaultSelectedUsers={[userStore.myProfile]}
          disabledIds={[userStore.myProfile.id]}
          showMeOnFriendTab={false}
          useFriends
        />
      )}
    </Observer>
  );
};

export default MobileOpenRoomCreatePage;
