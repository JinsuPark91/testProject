import React from 'react';
import styled from 'styled-components';

function SpaceMemberHeader({ spaceName, userCount }) {
  return (
    <StyledWrapper>
      <StyledSpaceName>{spaceName}</StyledSpaceName>
      <StyledUserCounter>{userCount}명</StyledUserCounter>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  display: flex;
  width: 100%;
  margin: 0.38rem 0rem;
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

export default SpaceMemberHeader;
