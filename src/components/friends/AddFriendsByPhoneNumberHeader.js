import React, { useState, useRef, useEffect } from 'react';
import { Row, Col } from 'antd';
import { Select, Option, Input } from 'teespace-core';
import { useStore } from '../../stores';

function AddFriendsByPhoneNumberHeader({
  handleNationalCodeChange,
  handlePhoneChange,
  phone,
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
      <Row>
        <Col span={24}>
          <Input placeholder="추가할 친구의 별명을 입력해 주세요." />
        </Col>
        <Col span={24} style={{ display: 'flex' }}>
          <Select
            onChange={handleNationalCodeChange}
            style={{ width: 130 }}
            dropdownStyle={{ width: dropdownWidth }}
            optionLabelProp="title"
          >
            <Option value="+1" title="+1">
              +1 (1) United States of America
            </Option>
            <Option value="+1340" title="+1 340">
              +1 340 (1340) United States Virgin Islands
            </Option>
            <Option value="+1670" title="+1 670">
              +1 670 (1670) Northern Mariana Islands
            </Option>
            <Option value="+82" title="+82">
              +82 Korea, Republic of
            </Option>
          </Select>
          <Input
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
        </Col>
      </Row>
    </div>
  );
}

export default AddFriendsByPhoneNumberHeader;
