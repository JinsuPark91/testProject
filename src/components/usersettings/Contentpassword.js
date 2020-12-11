import React, { useState } from 'react';
import ContentTitle from './ContentTitle';
import { Button } from 'teespace-core';
import styled from 'styled-components';
import Password from 'antd/lib/input/Password';

const PasswordBox = styled.div`
  display: flex;
  align-items: center;
  margin-top: 1.25rem;
  padding: 0.25rem 0 1.25rem;
  border-top: 1px solid #d8d8d8;
  font-size: 0.81rem;
  line-height: 1.19rem;
  color: #000;
  .ant-btn {
    margin-left: 1.28rem;
    padding: 0 0.81rem;
  }
`
const PassworTitle = styled.p`
  min-width: 13.13rem;
  padding-right: 1.25rem;
`
const PassworContent = styled.span`
  font-weight: 500;
`

function Contentpassword({ isEdit, onClick }) {
  const [date, setDate] = useState(new Date());
  const [isChecked, setIsChecked] = useState(false);

  const handleChange = (checked) => {
    setIsChecked(checked);
  }

  return (
    <>
      <ContentTitle
        title="비밀번호 변경"
        subTitle="보안을 위해 비밀번호를 항상 최신 상태로 업데이트하세요."
      />
      <PasswordBox>
        <PassworTitle>최종 변경일</PassworTitle>
        <PassworContent>
          {date.toLocaleDateString()}
          {date.toLocaleTimeString()}
        </PassworContent>
        <Button
          type="system"
          size="small"
          onClick={onClick}
          onChange={handleChange}
        >
          비밀번호 변경
        </Button>
      </PasswordBox>
    </>
  );
}
export default Contentpassword;
