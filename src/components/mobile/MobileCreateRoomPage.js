import React, { useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { UserRepository, useCoreStores } from 'teespace-core';

const MobileCreateRoomPage = () => {
  const { loginUserId } = useParams();
  const history = useHistory();
  const { userStore, roomStore } = useCoreStores();

  useEffect(() => {
    (async () => {
      try {
        const userId = await UserRepository.getUUID({ loginId: loginUserId });

        const data = {
          creatorId: userStore.myProfile.id,
          userList: [{ userId }],
          type: 'private',
          language: userStore.myProfile.language,
        };
        const { roomId } = await roomStore.createRoom(data);
        const existRoom = roomStore.getRoomMap().get(roomId);

        if (existRoom) {
          const myUserId = userStore.myProfile.id;
          await roomStore.updateRoomMemberSetting({
            roomId,
            myUserId,
            newIsVisible: true,
          });
        }
        console.log(roomId);
        history.push(`/talk/${roomId}`);
      } catch (e) {
        history.push(`/friend/${userStore.myProfile.id}`);
      }
    })();
  }, []);

  return <></>;
};

export default MobileCreateRoomPage;
