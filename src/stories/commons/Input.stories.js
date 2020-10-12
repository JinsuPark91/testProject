import React, { useState, useEffect } from 'react';
import { Input, Form } from 'antd';
import CommonInput from '../../components/commons/Input';
import CommonButton from '../../components/commons/Button';

export default {
  title: 'Commons/Input',
  component: CommonInput,
  argTypes: {
    onChange: {
      action: 'onChange',
    },
    alert: {
      type: 'string',
      required: false,
    },
    checked: {
      type: 'boolean',
    },
    placement: {
      control: {
        type: 'select',
        options: [
          'bottom',
          'topLeft',
          'topRight',
          'leftTop',
          'left',
          'leftBottom',
          'rightTop',
          'right',
          'rightBottom',
          'bottomLeft',
          'bottomRight',
        ],
      },
    },
    getPopupContainer: {
      control: false,
      description: 'alert tooltip을 append 할 DOM object를 리턴하는 함수',
    },
    disabled: {
      type: 'boolean',
      defaultValue: false,
    },
    type: {
      type: 'string',
      defaultValue: 'text',
    },
    placeholder: {
      type: 'string',
    },
  },
  args: {},
};

const Template = props => <CommonInput {...props} />;

const Template2 = props => {
  const [form] = Form.useForm();
  const [msg, setMsg] = useState('');
  const handleFinishFailed = () => {
    setMsg(form.getFieldError('username')[0]);
  };
  return (
    <Form form={form} onFieldsChange={handleFinishFailed}>
      <Form.Item
        name="username"
        rules={[
          { required: true, message: 'Please input your E-mail' },
          {
            type: 'email',
          },
        ]}
        noStyle
      >
        <CommonInput {...props} alert={msg} />
      </Form.Item>
      <Form.Item>
        <CommonButton type="solid" htmlType="submit">
          Register
        </CommonButton>
      </Form.Item>
    </Form>
  );
};

export const Text = Template.bind({});
Text.args = {
  getPopupContainer: () => document.body,
  placeholder: 'Enter your name',
};

export const TextWithAlert = Template.bind({});
TextWithAlert.args = {
  getPopupContainer: () => document.body,
  alert: 'Enter your name',
};

export const TextWithChecked = Template.bind({});
TextWithChecked.args = {
  checked: true,
};

export const TextWithRules = Template2.bind({});
TextWithRules.parameters = {
  docs: {
    source: {
      code: `
    props => {
  const [form] = Form.useForm();
  const [msg, setMsg] = useState('');
  const handleFinishFailed = () => {
    setMsg(form.getFieldError('username')[0]);
  };
  return (
    <Form form={form} onFieldsChange={handleFinishFailed}>
      <Form.Item
        name="username"
        rules={[
          { required: true, message: 'Please input your E-mail' },
          {
            type: 'email',
          },
        ]}
        noStyle
      >
        <CommonInput {...props} alert={msg} />
      </Form.Item>
      <Form.Item>
        <CommonButton type="solid" htmlType="submit">
          Register
        </CommonButton>
      </Form.Item>
    </Form>
  );
};`,
    },
  },
};

export const Password = Template.bind({});
Password.args = {
  getPopupContainer: () => document.body,
  type: 'password',
  defaultValue: 'this is password',
};
