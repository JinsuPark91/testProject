import React, { useCallback, useState, useRef } from 'react';
import styled from 'styled-components';
import { Layout } from 'antd';
import FriendsLNBHeader from './FriendsLNBHeader';
import FriendsLNBContent from './FriendsLNBContent';
import FriendsLNBFooter from './FriendsLNBFooter';

const { Content, Footer, Sider } = Layout;

const FriendsLNBWrapper = styled(Layout)`
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #f5f5fb;
`;
/**
 * 프렌즈 LNB
 * @param {Object} props
 */
function FriendsLNB(props) {
  const [searchKeyword, setSearchKeyword] = useState('');
  const lnbRef = useRef(null);
  const handleSearchKeyword = useCallback(e => {
    setSearchKeyword(e.target.value);
  }, []);

  const handleClearKeyword = useCallback(() => {
    setSearchKeyword('');
  }, []);

  return (
    <FriendsLNBWrapper>
      <div ref={lnbRef} />
      <FriendsLNBHeader
        handleInputChange={handleSearchKeyword}
        handleInputClear={handleClearKeyword}
      />
      <FriendsLNBContent
        searchKeyword={searchKeyword}
        meTooltipPopupContainer={() => {
          return lnbRef.current;
        }}
      />
      <FriendsLNBFooter />
    </FriendsLNBWrapper>
  );
}

export default FriendsLNB;
