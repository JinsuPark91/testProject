import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../../stores';
import CommonSelect, { CommonOption } from '../commons/Select';
import CommonInput from '../commons/Input';

function AddFriendsByPhoneNumberHeader() {
  const { uiStore } = useStore();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [dropdownWidth, setDropdownWidth] = useState(0);
  const [validateStatus, setValidateStatus] = useState('success');
  const formContainer = useRef(null);

  const handleChange = e => {
    const isNum = /^\d+$/.test(e.target.value) || e.target.value === '';
    setPhoneNumber(e.target.value);
    console.log('isNum', isNum);
    if (isNum) {
      setValidateStatus('success');
      uiStore.setAddFriendByPhoneNumberButtonDisabled(false);
    } else {
      setValidateStatus('error');
      uiStore.setAddFriendByPhoneNumberButtonDisabled(true);
    }
  };

  useEffect(() => {
    console.log(formContainer);
    if (formContainer.current) {
      setDropdownWidth(formContainer.current.clientWidth);
    }
  }, [formContainer]);
  return (
    <div ref={formContainer}>
      <div style={{ display: 'flex' }}>
        <CommonSelect
          style={{ width: 130 }}
          dropdownStyle={{ width: dropdownWidth }}
          optionLabelProp="title"
        >
          <CommonOption value="1" title="+1">
            +1 (1) United States of America
          </CommonOption>
          <CommonOption value="1340" title="+1 340">
            +1 340 (1340) United States Virgin Islands
          </CommonOption>
          <CommonOption value="1670" title="+1 670">
            +1 670 (1670) Northern Mariana Islands
          </CommonOption>
        </CommonSelect>
        <CommonInput
          alert={validateStatus !== 'success' ? '숫자만 입력해 주세요' : ''}
          placeholder="'-'없이 숫자만 입력해 주세요."
          onChange={handleChange}
          value={phoneNumber}
          style={{ width: '100%' }}
        />
      </div>
    </div>
  );
}

export default AddFriendsByPhoneNumberHeader;
