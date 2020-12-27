import React from 'react';
import { Divider } from 'antd';
import styled from 'styled-components';

function AddFriendsFromSpaceHeader({ spaceName, userCount }) {
  return (
    <>
      <StyledDivider />
      <StyledWrapper>
        <StyledSpaceName>{spaceName}</StyledSpaceName>
        <StyledUserCounter>{userCount}명</StyledUserCounter>
      </StyledWrapper>
    </>
  );
}

const StyledDivider = styled(Divider)`
  margin: 0;
`;

const StyledWrapper = styled.div`
  display: flex;
  margin: 0.38rem 0.75rem;
`;

const StyledSpaceName = styled.div`
  display: flex;
  font-size: 0.75rem;
`;

const StyledUserCounter = styled.div`
  flex: 1;
  text-align: right;
  align-self: center;
`;

export default AddFriendsFromSpaceHeader;
