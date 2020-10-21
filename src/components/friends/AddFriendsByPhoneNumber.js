import React, { useCallback, useState } from 'react';
import { useStore } from '../../stores';
import AddFriendsByPhoneNumberHeader from './AddFriendsByPhoneNumberHeader';
import AddFriendsByPhoneNumberContent from './AddFriendsByPhoneNumberContent';

function AddFriendsByPhoneNumber() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [nationalCode, setNationalCode] = useState(null);
  const [friendNick, setFriendNick] = useState('');

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

  const handleFriendNickChange = useCallback(
    e => setFriendNick(e.target.value),
    [],
  );

  const handleNationalCodeChange = useCallback(value => {
    setNationalCode(value);
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <AddFriendsByPhoneNumberHeader
        handlePhoneChange={handlePhoneChange}
        handleNationalCodeChange={handleNationalCodeChange}
        handleFriendNickChange={handleFriendNickChange}
        phone={phoneNumber}
      />
      <AddFriendsByPhoneNumberContent
        nationalCode={nationalCode}
        phone={phoneNumber}
        friendNick={friendNick}
      />
    </div>
  );
}

export default AddFriendsByPhoneNumber;
