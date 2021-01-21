import React from 'react';
import styled from 'styled-components';
import { WaplSearch } from 'teespace-core';

/**
 * Friends LNB Header
 * @param {Object} props
 * @param {function} props.handleInputChange
 */

const SearchBox = styled.div`
  padding: 0.5rem 0.75rem;
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
    padding: 0.38rem 1.88rem;
    &::placeholder {
      color: #929aa4;
    }
  }
`;

function FriendsLNBHeader({ handleInputChange, handleInputClear }) {
  return (
    <SearchBox>
      <WaplSearch
        type="underline"
        onChange={handleInputChange}
        onClear={handleInputClear}
        placeholder="프렌즈 검색"
        isCountExist={false}
      />
    </SearchBox>
  );
}

export default FriendsLNBHeader;
