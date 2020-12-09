import React from 'react';
import styled from 'styled-components';
import { Layout } from 'antd';
import { Search } from 'teespace-core';
import { OpenChatIcon } from '../Icons';

const { Header } = Layout;

/**
 * Friends LNB Header
 * @param {Object} props
 * @param {function} props.handleInputChange
 */

const StyledHeader = styled(Header)`
  background-color: transparent;
  width: 100%;
  height: auto;
  line-height: 1.82rem;
  padding: 0.63rem 0.75rem 0.38rem;
`;
const SearchBox = styled.div`
  .anticon {
    color: #bdc6d3;
  }
  .anticon-search {
    margin-left: 0.63rem;
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

const StyledSearch = styled(Search)`
  &.openhomeinput {
    height: 1.81rem;
    &:hover:not(:disabled),
    &:focus:not(:disabled) {
      background-color: #fff;
      border: 1px solid #6c56e5;
    }
  }
`;
function FriendsLNBHeader({ handleInputChange, handleInputClear }) {
  return (
    <StyledHeader>
      <SearchBox>
        <StyledSearch
          onChange={handleInputChange}
          onClear={handleInputClear}
          placeholder="룸 이름, 멤버 검색"
          style={{ width: '100%' }}
        />
      </SearchBox>
    </StyledHeader>
  );
}

export default FriendsLNBHeader;
