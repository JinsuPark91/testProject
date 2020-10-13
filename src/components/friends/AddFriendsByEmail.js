import React, { useState } from 'react';
import styled from 'styled-components';
import { useCoreStores } from 'teespace-core';
import AddFriendsByEmailHeader from './AddFriendsByEmailHeader';
import AddFriendsByEmailContent from './AddFriendsByEmailContent';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

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
    <Wrapper>
      <AddFriendsByEmailHeader handleSearchUser={handleSearchUser} />
      <AddFriendsByEmailContent userLoginId={userLoginId} />
    </Wrapper>
  );
}

export default AddFriendsByEmail;
