import React, { Component, useState } from 'react';
import SettingContentTitle from './SettingContentTitle';
import { Row} from 'antd';
import { CheckOutlined } from '@ant-design/icons';
import { Input, Form } from 'teespace-core';
import { useCoreStores } from 'teespace-core';
import NewPasswordInput from '../Signup/NewPasswordInput';


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

function SettingContentpasswordedit(props) {
  const { authStore, userStore } = useCoreStores();
  const {form} = props;
  const [msg, setMsg] = useState({});

  const handleFinishFailed = () => {
    const errors = {};
    form.current
      .getFieldsError([
        'password',
        'passwordConfirm',
      ])
      .forEach(error => {
        errors[error.name[0]] = error.errors[0];
      });
    setMsg(errors);
  };



  const handleFinish = values => {
    // userStore.updateMyProfile({updatedInfo:values})
    console.log(values);
  };
  
  return (
    <>
             {/* validateTrigger = {['onChange', 'onBlur']} */}

      <SettingContentTitle
        title="비밀번호 변경"
        subTitle="보안을 위해 비밀번호를 항상 최신 상태로 업데이트하세요."
      ></SettingContentTitle>
      현재 비밀번호{' '}
      <Input
        getPopupContainer={() => {}}
        onBlur={()=>console.log('123')}
        onValuechange={handleFinish}
        type="password"        
      />
      <Form
        {...formItemLayout}
        form={form.current}
        name="register"
        onFinish={handleFinish}
        onFieldsChange={handleFinishFailed}
        scrollToFirstError
      >     
        <NewPasswordInput msg={msg.password} msg2={msg.passwordConfirm}>

        </NewPasswordInput>

        </Form>
    
    </>
  );
}
export default SettingContentpasswordedit;
