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
  margin: 0 0 0.38rem 0;
`;

const StyledSpaceName = styled.span`
  display: flex;
  font-size: 0.75rem;
`;

const StyledUserCounter = styled.span`
  display: flex;
  font-size: 0.75rem;
  color: #6c56e5;
  margin-left: 0.25rem;
`;

export default SpaceMemberHeader;
