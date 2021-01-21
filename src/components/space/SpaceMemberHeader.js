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
`;

const StyledSpaceName = styled.span`
  display: flex;
  color: #000000;
  font-size: 0.75rem;
`;

const StyledUserCounter = styled.span`
  flex: 1;
  text-align: right;
  align-self: center;
  font-size: 0.75rem;
  color: #000000;
`;

export default SpaceMemberHeader;
