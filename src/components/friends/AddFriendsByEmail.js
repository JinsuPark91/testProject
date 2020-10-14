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
  const [searchedUser, setSearchedUser] = useState(null);

  const handleSearchUser = async e => {
    setUserLoginId(e.target.value);
    const idSearchedUser = await userStore.searchUserById({
      userId: authStore.user.id,
      userLoginId: e.target.value,
    });
    setSearchedUser(idSearchedUser);
  };
  return (
    <Wrapper>
      <AddFriendsByEmailHeader handleSearchUser={handleSearchUser} />
      <AddFriendsByEmailContent
        userLoginId={userLoginId}
        searchedUser={searchedUser}
      />
    </Wrapper>
  );
}

export default AddFriendsByEmail;
