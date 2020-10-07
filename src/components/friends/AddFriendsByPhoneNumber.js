import React from 'react';
import AddFriendsByPhoneNumberHeader from './AddFriendsByPhoneNumberHeader';
import AddFriendsByPhoneNumberContent from './AddFriendsByPhoneNumberContent';

function AddFriendsByPhoneNumber() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <AddFriendsByPhoneNumberHeader />
      <AddFriendsByPhoneNumberContent />
    </div>
  );
}

export default AddFriendsByPhoneNumber;