import React from 'react';
import styled from 'styled-components';
import { Layout } from 'antd';
import { Search } from 'teespace-core';

const { Header } = Layout;

/**
 * Friends LNB Header
 * @param {Object} props
 * @param {function} props.handleInputChange
 */

const StyledHeader = styled(Header)`
  background-color: transparent;
  width: 100%;
  padding: 0 0.8125rem;
`;

function FriendsLNBHeader({ handleInputChange, handleInputClear }) {
  return (
    <StyledHeader>
      <Search
        onChange={handleInputChange}
        onClear={handleInputClear}
        placeholder="프렌즈 검색"
        style={{ width: '100%' }}
      />
    </StyledHeader>
  );
}

export default FriendsLNBHeader;
