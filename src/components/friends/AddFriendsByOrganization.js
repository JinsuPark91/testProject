import React from 'react';
import styled from 'styled-components';
import { Divider } from 'antd';
import AddFriendsByOrganizationHeader from './AddFriendsByOrganizationHeader';
import AddFriendsByOrganizationContent from './AddFriendsByOrganizationContent';

const NegativeMargin = styled.div`
  margin: -16px;
`;

const StyledDivider = styled(Divider)`
  margin: 0;
`;
function AddFriendsByOrganization() {
  return (
    <NegativeMargin>
      <AddFriendsByOrganizationHeader />
      <StyledDivider />
      <AddFriendsByOrganizationContent />
    </NegativeMargin>
  );
}

export default AddFriendsByOrganization;
