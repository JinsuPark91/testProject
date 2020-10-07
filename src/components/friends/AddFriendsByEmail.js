import React from 'react';
import AddFriendsByEmailHeader from './AddFriendsByEmailHeader';
import AddFriendsByEmailContent from './AddFriendsByEmailContent';

function AddFriendsByEmail() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <AddFriendsByEmailHeader />
      <AddFriendsByEmailContent />
    </div>
  );
}

export default AddFriendsByEmail;