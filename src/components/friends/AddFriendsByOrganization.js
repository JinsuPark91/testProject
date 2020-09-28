import React from 'react';
import AddFriendsByOrganizationHeader from './AddFriendsByOrganizationHeader';
import AddFriendsByOrganizationContent from './AddFriendsByOrganizationContent';

function AddFriendsByOrganization() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <AddFriendsByOrganizationHeader />
      <AddFriendsByOrganizationContent />
    </div>
  );
}

export default AddFriendsByOrganization;
