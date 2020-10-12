import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../../stores';
import CommonSelect, { CommonOption } from '../commons/Select';
import CommonInput from '../commons/Input';

function AddFriendsByPhoneNumberHeader({
  handleNationalCodeChange,
  handlePhoneChange,
  phone,
  nationalCode,
}) {
  const { uiStore } = useStore();
  const [dropdownWidth, setDropdownWidth] = useState(0);
  const formContainer = useRef(null);

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
          onChange={handleNationalCodeChange}
          style={{ width: 130 }}
          dropdownStyle={{ width: dropdownWidth }}
          optionLabelProp="title"
        >
          <CommonOption value="+1" title="+1">
            +1 (1) United States of America
          </CommonOption>
          <CommonOption value="+1340" title="+1 340">
            +1 340 (1340) United States Virgin Islands
          </CommonOption>
          <CommonOption value="+1670" title="+1 670">
            +1 670 (1670) Northern Mariana Islands
          </CommonOption>
          <CommonOption value="+82" title="+82">
            +82 Korea, Republic of
          </CommonOption>
        </CommonSelect>
        <CommonInput
          alert={
            phone && uiStore.addFriendByPhoneNumberButtonDisabled
              ? '숫자만 입력해 주세요'
              : ''
          }
          placeholder="'-'없이 숫자만 입력해 주세요."
          onChange={handlePhoneChange}
          value={phone}
          style={{ width: '100%' }}
        />
      </div>
    </div>
  );
}

export default AddFriendsByPhoneNumberHeader;
