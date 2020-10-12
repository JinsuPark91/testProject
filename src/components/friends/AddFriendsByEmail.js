import React, { useState } from 'react';
import { useCoreStores } from 'teespace-core';
import AddFriendsByEmailHeader from './AddFriendsByEmailHeader';
import AddFriendsByEmailContent from './AddFriendsByEmailContent';

function AddFriendsByEmail() {
  const { userStore, authStore } = useCoreStores();
  const [userLoginId, setUserLoginId] = useState('');

  const handleSearchUser = e => {
    userStore.searchUserById({
      myUserId: authStore.user.id,
      userLoginId: e.target.value,
    });
    setUserLoginId(e.target.value);
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <AddFriendsByEmailHeader handleSearchUser={handleSearchUser} />
      <AddFriendsByEmailContent userLoginId={userLoginId} />
    </div>
  );
}

export default AddFriendsByEmail;
