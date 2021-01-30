import React from 'react';
import styled from 'styled-components';
import { WaplSearch } from 'teespace-core';

/**
 * Friends LNB Header
 * @param {Object} props
 * @param {function} props.handleInputChange
 */

const SearchBox = styled.div`
  padding: 0.63rem 0.75rem;
  .anticon {
    color: #bdc6d3;
  }
  &:hover,
  &:focus {
    .anticon {
      color: #000;
    }
  }
  .ant-input {
    &::placeholder {
      color: #bcbcbc;
    }
  }
`;
const FriendSearch = styled(WaplSearch)`
  &.friendSearch {
    height: 1.75rem;
    padding: 0;
    border-width: 0 0 0.06rem 0;
  }
`;

function FriendsLNBHeader({ handleInputChange, handleInputClear }) {
  return (
    <SearchBox>
      <FriendSearch
        className="friendSearch"
        type="underline"
        searchIconColor={{ active: '#17202B', default: '#C6CED6' }}
        clearIconColor={{ active: '#17202B', default: '#C6CED6' }}
        onChange={handleInputChange}
        onClear={handleInputClear}
        placeholder="프렌즈 검색"
        isCountExist={false}
      />
    </SearchBox>
  );
}

export default FriendsLNBHeader;
