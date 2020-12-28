import React, { useEffect, useState, useCallback } from 'react';
import { useObserver } from 'mobx-react';
import styled from 'styled-components';
import SpaceMemberHeader from '../space/SpaceMemberHeader';
import AddFriendsItem from './AddFriendsItem';

function AddFriendsFromSpace({ spaceName, spaceMembers, searchText }) {
  const [searchedUserList, setSearchedUserList] = useState([]);

  const handleSearch = useCallback(async () => {
    const userList = spaceMembers.filter(elem =>
      elem.name.toLowerCase().includes(searchText.toLowerCase()),
    );
    // .sort((item1, item2) =>
    //   item1.isMe ? -1 : item1.name.localeCompare(item2.name),
    // );
    setSearchedUserList(userList);
  }, [searchText, spaceMembers]);

  useEffect(() => {
    if (searchText) {
      handleSearch();
    } else {
      setSearchedUserList(spaceMembers);
    }
  }, [spaceMembers, searchText, handleSearch]);

  return useObserver(() => (
    <Wrapper>
      <SpaceMemberHeader
        spaceName={spaceName}
        userCount={searchedUserList.length}
      />
      <AddFriendsItem friendAddList={searchedUserList} isViewMode={false} />
    </Wrapper>
  ));
}

const Wrapper = styled.div`
  width: 100%;
  padding: 0.63rem 0.81rem 0.63rem 0.63rem;
`;

export default AddFriendsFromSpace;
