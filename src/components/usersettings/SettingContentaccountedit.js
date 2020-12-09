import React, { Component, useState } from 'react';
import { Image, Radio, Upload, message } from 'antd';
import { CameraOutlined } from '@ant-design/icons';
import {
  useCoreStores,
  Dropdown,
  Menu,
  Input,
  Button,
  Form,
} from 'teespace-core';
import styled, { css } from 'styled-components';
import SettingContentTitle from './SettingContentTitle';
import Menudropdownnation from './Menudropdownnation';
import Imageupload from './Imageupload';

const AccounteditBordertop = styled.div`
  display: flex;
  border-top: 1px solid;
  border-top-color: #d8d8d8;
  font-size: 1.25rem;
  font-weight: bold;
  font-color: #777777;
`;

const ImageChangeButton = styled(Text)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  background: black;
  border-radius: 50%;
  position: absolute;

  &:hover {
    background: rgba(90, 95, 255);
    cursor: pointer;
  }

  ${props => {
    switch (props.position) {
      case 'tl':
      default:
        return css`
          top: 10px;
          left: 10px;
        `;

      case 'tr':
        return css`
          top: 10px;
          right: 10px;
        `;
      case 'bl':
        return css`
          bottom: 10px;
          left: 10px;
        `;
      case 'br':
        return css`
          bottom: 10px;
          right: 10px;
        `;
    }
  }}
`;

function onChange(e) {
  console.log('checked = ${e.target.checked}');
}

function SettingContentaccountedit(props) {
  const { authStore, userStore } = useCoreStores();
  const { onChange, form } = props;
  const [imageupload, setimageupload] = useState(false);
  const [savevisible, setsavevisible] = useState(true);

  function handleupload() {
    setimageupload(true);
  }

  const menu = (
    <Menu>
      <Menu.Item>
        <Upload>
          <Button type="text">프로필 사진 변경</Button>
        </Upload>
      </Menu.Item>
      <Menu.Item onClick={handleupload}>
        <Button type="text">기본 사진 변경</Button>
      </Menu.Item>
    </Menu>
  );

  const handleFinish = async values => {
    await userStore.updateMyProfile({ updatedInfo: values });
    props.footonChange();
  };

  return (
    <div>
      <SettingContentTitle
        title="계정정보변경"
        subTitle="TeeSpace 계정정보를 확인하고 최신 정보로 안전하게 관리하세요."
      />
      <Image
        width={125}
        height={125}
        src={`/${userStore.getUserProfilePhoto({
          userId: authStore.user.id,
          size: 'medium',
          isLocal: true,
          thumbPhoto: null,
        })}`}
      />
      <br />
      <Dropdown overlay={menu}>
        <Button type="solid">
          <CameraOutlined />
        </Button>
      </Dropdown>
      {imageupload ? console.log('true') : console.log('false')}
      {authStore.user.name} , {authStore.user.nick} <br />, {authStore.user.id}
      <br />
      <br />
      <AccounteditBordertop>
        <div>
          프로필 정보 <br />
        </div>
      </AccounteditBordertop>
      <Form form={form.current} onFinish={handleFinish}>
        <Form.Item name="nationalcode">
          <div>
            국가 <Menudropdownnation onChange={onChange} />
          </div>
        </Form.Item>
        <Form.Item name="companyNum">
          <div>
            회사 번호{' '}
            <Input
              style={{ width: 200 }}
              placeholder="입력하세요"
              onChange={onChange}
            />
          </div>
        </Form.Item>
        <Form.Item name="phone">
          <div>
            휴대폰 번호{' '}
            <Input
              style={{ width: 200 }}
              placeholder="입력하세요"
              onChange={onChange}
            />
          </div>
        </Form.Item>

        <div>이메일 주소</div>
        <AccounteditBordertop>
          <div>
            개인정보 <br />
          </div>
        </AccounteditBordertop>
        <Form.Item name="birthDate">
          <div>
            생년월일{' '}
            <Input
              onChange={onChange}
              style={{ width: 300 }}
              placeholder="8자리 형태로 입력(YYYYMMDD)"
            />
          </div>
        </Form.Item>
        <div>
          소속회사/부서 {authStore.user.orgName} /{' '}
          {authStore.user.departmentName}
        </div>
        <div>직위/직책 {authStore.user.position}</div>
        <div>
          서비스 이용 동의 <br />
          <br />
        </div>
        <Form.Item name="agreement">
          <div>
            뉴스레터, 프로모션 등 안내 메일 수신 동의
            <Radio.Group onChange={onChange}>
              <Radio value={1}>동의함</Radio>
              <Radio value={2}>동의하지 않음</Radio>{' '}
            </Radio.Group>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
}

export default SettingContentaccountedit;
