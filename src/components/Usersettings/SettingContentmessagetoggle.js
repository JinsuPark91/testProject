import React, { Component } from 'react';
import { Checkbox } from 'teespace-core';
import { Form } from 'antd';

function onChange(e) {
  console.log(`checked = ${e.target.checked}`);
}
function SettingContentmessagetoggle(props) {
    const { form } = props;


    return (
      <div>
        <Form.Item name="Meassagepreview" valuePropName="checked">
        <Checkbox onChange={onChange} shape="round">
          메시지 내용 미리보기
        </Checkbox></Form.Item>
      </div>
    );
  
}
export default SettingContentmessagetoggle;
