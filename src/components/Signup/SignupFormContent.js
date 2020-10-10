import React from 'react';
import styled from 'styled-components';
import { Form, Button } from 'antd';
import NewIdInput from './NewIDinput';
import NewPasswordInput from './NewPasswordInput';
import CommonInput from '../commons/Input';
import CommonButton from '../commons/Button';
import AuthMobileInput from './AuthMobileInput';

const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 8,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 16,
    },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};

const CommonContent = styled.div`
  height: auto;
  width: 40.26rem;
  border-style: solid;
  padding: 3.63rem 4.38rem;
  border-width: 0.06rem;
  border-radius: 0.94rem;
  box-shadow: 0rem 0rem 0.75rem 0.06rem rgba(125, 138, 148, 0.1);
  border-color: #e3e7eb;
  display: flex;
  flex-direction: column;
`;
const SignupFormContent = () => {
  const [form] = Form.useForm();

  const onFinish = values => {
    console.log('Received values of form: ', values);
  };

  return (
    <CommonContent>
      <Form
        {...formItemLayout}
        form={form}
        name="register"
        onFinish={onFinish}
        scrollToFirstError
      >
        <NewIdInput />
        <NewPasswordInput />
        <div>이름</div>
        <Form.Item
          name="name"
          rules={[
            {
              required: true,
              message: 'Please input your nickname!',
              whitespace: true,
            },
          ]}
        >
          <CommonInput placeholder="이름을 입력해 주세요." />
        </Form.Item>

        <AuthMobileInput />

        <Form.Item {...tailFormItemLayout}>
          <CommonButton type="solid" htmlType="submit">
            가입 완료
          </CommonButton>
        </Form.Item>
      </Form>
    </CommonContent>
  );
};

export default SignupFormContent;
