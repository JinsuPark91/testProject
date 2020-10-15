import React, { Component } from 'react';
import {  Image, Radio, Form, Upload, message } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import SettingContentTitle from './SettingContentTitle';
import Menudropdownnation from './Menudropdownnation';
import Imageupload from './Imageupload';
import { useCoreStores } from 'teespace-core';
import CommonButton from '../commons/Button';
import CommonInput from '../commons/Input';
import CommonRadio from '../commons/Radio';
import styled from 'styled-components';


const AccounteditBordertop = styled.div`
  display: flex;
  border-top: 1px solid;
  border-top-color: #d8d8d8;
  font-size: 20px;
  font-weight: bold;
  font-color: #777777;
`;

function onChange(e) {
  console.log('checked = ${e.target.checked}');
}

function SettingContentaccountedit(props) {
  const { authStore } = useCoreStores();
  const {onChange} = props;
 
    return (
      <div>
        <SettingContentTitle
          title="계정정보변경"
          subTitle="TeeSpace 계정정보를 확인하고 최신 정보로 안전하게 관리하세요."
        ></SettingContentTitle>
       <Image width={125} height={125} src={authStore.user.thumbPhoto} />
       <Imageupload width={15} height={15}></Imageupload><br/>
        {authStore.user.name} , {authStore.user.nick} <br />, {authStore.user.id}
        <br />
         <br />
        <AccounteditBordertop>
        <div>
          프로필 정보 <br />
        </div> 
        </AccounteditBordertop>
        <Form.Item name="usernation" >
          <div>국가 <Menudropdownnation onChange={onChange}></Menudropdownnation></div> 
          </Form.Item>
        {/* <Form.Item name="usercall" label="usercall"> */}
        <div>
          회사 번호 <CommonInput style={{ width: 200 }} placeholder="입력하세요" onChange={onChange} />
        </div>
         {/* </Form.Item> */}
        <div>
          휴대폰 번호 <CommonInput style={{ width: 200 }} placeholder="입력하세요" onChange={onChange} />
 
        </div>
        <div>이메일 주소</div>
     
        <AccounteditBordertop>
        <div>
          개인정보 <br />
        </div>
        </AccounteditBordertop>
        <div>
          생년월일{' '}
          <CommonInput onChange={onChange}
            style={{ width: 300 }}
            placeholder="8자리 형태로 입력(YYYYMMDD)"
          />
        </div>
        
        <div>소속회사/부서 {authStore.user.job}/{authStore.user.orgName}</div>
        <div>직위/직책 {authStore.user.position}</div>
        <div>
          서비스 이용 동의 <br />
          <br />
        </div>
        <div>
          뉴스레터, 프로모션 등 안내 메일 수신 동의
          <Radio.Group onChange={onChange}>
          <CommonRadio value={1}>동의함</CommonRadio>
        <CommonRadio value={2}>동의하지 않음</CommonRadio> </Radio.Group>
              </div>
      </div>
    );
  }


export default SettingContentaccountedit;
