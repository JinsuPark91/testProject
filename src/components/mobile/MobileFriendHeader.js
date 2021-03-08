import React from 'react';
import { observer } from 'mobx-react';
import { useCoreStores } from 'teespace-core';

const MobileFriendHeader = observer(
  ({ friendEditMode, handleFriendEditMode }) => {
    const { userStore } = useCoreStores();
    const myUserId = userStore.myProfile.id;
    const profilePhoto = userStore.getProfilePhotoURL(myUserId, 'small');

    if (friendEditMode) {
      return (
        <>
          <span onClick={handleFriendEditMode}>뒤로가기</span>
          <span>편집</span>
        </>
      );
    }

    return (
      <>
        <span>프렌즈</span>
        <span>검색 버튼</span>
        <span>프렌즈 추가 버튼</span>
        <span onClick={handleFriendEditMode}>수정 버튼</span>
        <img alt="profilePhoto" src={profilePhoto} />
      </>
    );
  },
);

export default MobileFriendHeader;
