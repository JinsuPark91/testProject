import React from 'react';
import { useHistory } from 'react-router-dom';
import { useCoreStores } from 'teespace-core';
import { getRoomId } from './MobileUtil';

const MobileSelectPage = () => {
  const history = useHistory();
  const { userStore } = useCoreStores();
  const myPhoto = userStore.getProfilePhotoURL(userStore.myProfile.id, 'small');

  const handleSelectNote = () => {
    history.push(`/note/${getRoomId()}`);
  };
  const handleSelectCalendar = () => {
    history.push(`/calendar/${getRoomId()}`);
  };

  return (
    <>
      <img alt="myPhoto" src={myPhoto} />
      <div onClick={handleSelectNote}>노트</div>
      <div onClick={handleSelectCalendar}>캘린더</div>
    </>
  );
};

export default MobileSelectPage;
