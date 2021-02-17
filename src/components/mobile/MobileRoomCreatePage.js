import React, { useState, useCallback } from 'react';
import { ItemSelector, useCoreStores } from 'teespace-core';

const MobileRoomCreatePage = ({ onOk, onCancel }) => {
  const { userStore } = useCoreStores();
  const initialOptions = {
    isChangeName: false,
    roomName: '',
    isStartMeeting: false,
  };
  const [options, setOptions] = useState(initialOptions);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const disabledIds = [userStore.myProfile.id];

  const clearState = () => {
    setOptions(initialOptions);
  };

  const handleOk = () => {
    onOk({
      ...options,
      selectedUsers,
    });
  };

  const handleCancel = () => {
    onCancel();
    clearState();
  };

  const handleSelectedUserChange = useCallback(({ userArray }) => {
    const filteredUsers = userArray.filter(
      user => !disabledIds.includes(user.friendId || user.id),
    );
    setSelectedUsers(filteredUsers);
  }, []);

  return (
    <>
      <div>
        <span onClick={onCancel}>뒤로가기</span>
        <span>프라이빗 룸 만들기</span>
        <span>초대 N</span>
      </div>
      <ItemSelector
        showTagList={false}
        isVisibleRoom={false}
        onSelectChange={handleSelectedUserChange}
        disabledIds={disabledIds}
        defaultSelectedUsers={[userStore.myProfile]}
        showMeOnFriendTab={false}
        height={25} // rem
      />
      {/* <ConfigWrapper>
        <ConfigTitle>
          <Checkbox
            className="check-round"
            defaultChecked
            disabled={selectedUsers.length < 2}
            checked={options.isChangeName}
            onChange={handleChangeNameChange}
          />
          <ConfigTitleText>룸 이름 설정하기</ConfigTitleText>
        </ConfigTitle>
      </ConfigWrapper> */}
    </>
  );
};

export default MobileRoomCreatePage;
