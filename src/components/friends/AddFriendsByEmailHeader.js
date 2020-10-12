import React from 'react';
import Search from '../commons/Search';

function AddFriendsByEmailHeader({ handleSearchUser }) {
  return (
    <Search
      placeholder="아이디 검색"
      style={{ width: '100%' }}
      onPressEnter={handleSearchUser}
    />
  );
}

export default AddFriendsByEmailHeader;
