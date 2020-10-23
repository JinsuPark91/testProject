import React, { Component } from 'react';
import SettingContentTitle from './SettingContentTitle';
import { Row } from 'antd';
import { CheckOutlined } from '@ant-design/icons';
import { Input } from 'teespace-core';

function SettingContentpasswordedit(props) {
  return (
    <>
      <SettingContentTitle
        title="비밀번호 변경"
        subTitle="보안을 위해 비밀번호를 항상 최신 상태로 업데이트하세요."
      ></SettingContentTitle>
      현재 비밀번호{' '}
      <Input
        defaultValue="this is password"
        getPopupContainer={() => {}}
        onChange={function noRefCheck() {}}
        type="password"
      />
      새 비밀번호{' '}
      <Input
        defaultValue="this is password"
        getPopupContainer={() => {}}
        onChange={function noRefCheck() {}}
        type="password"
      />
      <Row>
        <CheckOutlined className="NewIdLength" />
        <div>9 - 20자</div>
        <CheckOutlined className="NewIdValid" />
        <div>영문 소문자, 숫자와 특수기호 중 3가지 이상 조합</div>
      </Row>
      새 비밀번호 확인{' '}
      <Input
        defaultValue="this is password"
        getPopupContainer={() => {}}
        onChange={function noRefCheck() {}}
        type="password"
      />
    </>
  );
}
export default SettingContentpasswordedit;
