import React, { useState } from 'react';
import { Form } from 'antd';

export default function (props) {
  const { children } = props;
  return <Form {...props}>{children}</Form>;
}
export function CommonFormItem(props) {

  const [messages, setMessages] = useState([]);
  const { children } = props;
  const handleValidateMessages = (prevValues, curValues) => {
    console.log(prevValues, curValues);
  }
  return (
    <Form.Item shouldUpdate={handleValidateMessages}>
      {() => {
        return (
          <Form.Item {...props}>
            {children}
          </Form.Item>
        );
      }}
    </Form.Item>
  );
}
