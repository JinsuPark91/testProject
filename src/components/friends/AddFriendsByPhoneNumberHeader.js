import React, { useState, useRef, useEffect } from 'react';
import { Select, Form, Input } from 'antd';
import { useStore } from '../../stores';

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
    console.log(formContainer)
    if (formContainer.current) {
      setDropdownWidth(formContainer.current.clientWidth);
    }
  }, [formContainer]);
  return (
    <div ref={formContainer}>
      <div style={{ display: 'flex' }}>
        <Select
          style={{ width: 130 }}
          dropdownMatchSelectWidth={false}
          dropdownStyle={{ width: dropdownWidth }}
        >
          <Select.Option value="1">+1 (1) United States of America</Select.Option>
          <Select.Option value="1340">+1 340 (1340) United States Virgin Islands</Select.Option>
          <Select.Option value="1670">+1 670 (1670) Northern Mariana Islands</Select.Option>
        </Select>
        <Form.Item
          validateStatus={validateStatus}
          help={validateStatus !== 'success' && '숫자만 입력해 주세요'}
          hasFeedback={validateStatus !== 'success'}
          style={{ flex: 1, marginBottom: 0 }}
        >
          <Input
            placeholder="'-'없이 숫자만 입력해 주세요."
            id="error"
            onChange={handleChange}
            value={phoneNumber}
            style={{ flex: 1 }}
          />
        </Form.Item>
      </div>
    </div>
  );
}

export default AddFriendsByPhoneNumberHeader;
