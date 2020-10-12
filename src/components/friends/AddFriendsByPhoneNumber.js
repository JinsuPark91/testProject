import React, { useState } from 'react';
import { useStore } from '../../stores';
import AddFriendsByPhoneNumberHeader from './AddFriendsByPhoneNumberHeader';
import AddFriendsByPhoneNumberContent from './AddFriendsByPhoneNumberContent';

function AddFriendsByPhoneNumber() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [nationalCode, setNationalCode] = useState(null);

  const { uiStore } = useStore();
  const handlePhoneChange = e => {
    const isNum = /^\d+$/.test(e.target.value) || e.target.value === '';
    setPhoneNumber(e.target.value);
    if (isNum) {
      uiStore.setAddFriendByPhoneNumberButtonDisabled(false);
    } else {
      uiStore.setAddFriendByPhoneNumberButtonDisabled(true);
    }
  };

  const handleNationalCodeChange = value => {
    setNationalCode(value);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <AddFriendsByPhoneNumberHeader
        handlePhoneChange={handlePhoneChange}
        handleNationalCodeChange={handleNationalCodeChange}
        phone={phoneNumber}
        nationalCode={nationalCode}
      />
      <AddFriendsByPhoneNumberContent
        nationalCode={nationalCode}
        phone={phoneNumber}
      />
    </div>
  );
}

export default AddFriendsByPhoneNumber;
