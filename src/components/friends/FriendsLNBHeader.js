import React from 'react';
import styled from 'styled-components';
import { Layout, Input } from 'antd';
import CommonSearch from '../commons/Search';

const { Header } = Layout;

/**
 * Friends LNB Header
 * @param {Object} props
 * @param {function} props.handleInputChange
 */

const StyledHeader = styled(Header)`
  background-color: transparent;
  width: 100%;
  padding: 0 13px;
`;

function FriendsLNBHeader({ handleInputChange, handleInputClear }) {
  return (
    <StyledHeader>
      <CommonSearch
        onChange={handleInputChange}
        onClear={handleInputClear}
        placeholder="프렌즈 검색"
        style={{ width: '100%' }}
      />
    </StyledHeader>
  );
}

export default FriendsLNBHeader;
