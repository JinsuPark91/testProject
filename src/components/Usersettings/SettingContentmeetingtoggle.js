import React, { Component } from 'react';
import { Checkbox } from 'teespace-core';
import { Form } from 'antd';


function onChange(e) {
  // console.log(`checked = ${e.target.checked}`);
}

function SettingContentmeetingtoggle(props) {
  const { form } = props;


    return (
      <div>
        <Form.Item name="Meetingstartcheckbox" valuePropName="checked">
        <Checkbox onChange={onChange} shape="round">
          회의 시작
        </Checkbox></Form.Item>
        <Form.Item name="Meetingendcheckbox" valuePropName="checked">
        <Checkbox onChange={onChange} shape="round">
          회의 종료
        </Checkbox></Form.Item>
      </div>
    );
  }

export default SettingContentmeetingtoggle;
