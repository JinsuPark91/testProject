import React, { useState, useCallback } from 'react';
import { MobileItemSelector, useCoreStores } from 'teespace-core';

const MobileRoomCreatePage = ({ onCancel }) => {
  const { userStore } = useCoreStores();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const disabledIds = [userStore.myProfile.id];

  const handleCreateRoom = () => {
    console.log(`selected user is${selectedUsers}`);
    onCancel();
  };

  const handleSelectedUserChange = useCallback(({ userArray }) => {
    const filteredUsers = userArray.filter(
      user => !disabledIds.includes(user.friendId || user.id),
    );
    setSelectedUsers(filteredUsers);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div>
        <span onClick={onCancel}>뒤로가기</span>
        <span>프라이빗 룸 만들기</span>
        <span onClick={handleCreateRoom}>초대 N</span>
      </div>
      <MobileItemSelector
        isVisibleRoom={false}
        onSelectChange={handleSelectedUserChange}
        disabledIds={disabledIds}
        defaultSelectedUsers={[userStore.myProfile]}
        showMeOnFriendTab={false}
        height={25} // rem
      />
    </>
  );
};

export default MobileRoomCreatePage;
