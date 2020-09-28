import React from 'react';
import styled from 'styled-components';
import { Layout, Input } from 'antd';

const { Header } = Layout;

/**
 * Friends LNB Header
 * @param {Object} props
 * @param {function} props.handleInputChange
 */

const StyledHeader = styled(Header)`
  background-color: transparent;
  width: 100%;
`;

function FriendsLNBHeader({ handleInputChange }) {
  return (
    <StyledHeader>
      <Input onChange={handleInputChange} placeholder="프렌즈 검색" />
    </StyledHeader>
  );
}

export default FriendsLNBHeader;
