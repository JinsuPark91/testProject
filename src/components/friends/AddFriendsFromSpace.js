import React, { useEffect, useState, useCallback } from 'react';
import { useObserver } from 'mobx-react';
import { useCoreStores } from 'teespace-core';
import styled from 'styled-components';
import { Divider } from 'antd';
import AddFriendsFromSpaceHeader from './AddFriendsFromSpaceHeader';
import AddFriendsItem from './AddFriendsItem';

function AddFriendsFromSpace({ spaceName, spaceMembers, searchText }) {
  const { userStore } = useCoreStores();
  const [searchedUserList, setSearchedUserList] = useState([]);

  const handleSearch = useCallback(async () => {
    const userList = await userStore.searchUsersByKeyword({
      keyword: searchText,
    });
    setSearchedUserList(userList);
  }, [searchText, userStore]);

  useEffect(() => {
    if (searchText) {
      handleSearch();
    } else {
      setSearchedUserList(spaceMembers);
    }
  }, [spaceMembers, searchText, handleSearch]);

  return useObserver(() => (
    <Wrapper>
      <AddFriendsFromSpaceHeader
        spaceName={spaceName}
        userCount={searchedUserList.length}
      />
      <StyledDivider />
      <AddFriendsItem friendAddList={searchedUserList} />
    </Wrapper>
  ));
}

const Wrapper = styled.div`
  width: 100%;
  padding: 0.63rem 0.81rem 0.63rem 0.63rem;
`;

const StyledDivider = styled(Divider)`
  margin: 0;
`;

export default AddFriendsFromSpace;
