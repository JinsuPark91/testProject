import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import ProfileModal from '../profile/ProfileModal';
import { Button } from 'antd';
import Photos from '../Photos';
import Input from '../Input';
import AddIcon from '../../assets/ts_friends_add.svg';
import TalkIcon from '../../assets/ts_TeeTalk.svg';
import MeetingIcon from '../../assets/ts_TeeMeeting.svg';
import EditIcon from '../../assets/ts_edit.svg';

const AddButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 3.13rem;
  background-color: transparent;
  border: solid #E3E7EB;
  border-width: 1px 0 0;
  font-size: 0.81rem;
  color: #3b3b3b;
  outline: none;
  cursor: pointer;
  &:before {
    content: '';
    display: inline-block;
    width: 1.5rem;
    height: 1.5rem;
    margin-right: 0.38rem;
    background: url(${AddIcon}) no-repeat 50% 50%;
    background-size: contain;
  }
`
const UserList = styled.div`
  overflow-y: auto;
  height: 13.5rem;
  padding: 0.94rem;
`
const UserItem = styled.div`
  display: flex;
  align-items: center;
  &+&{
    margin-top: 0.63rem;
  }
`
const UserImag = styled.div`
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
  cursor: pointer;
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }
`
const UserName = styled.p`
  padding-left: 0.5rem;
  font-size: 0.75rem;
  line-height: 1.13rem;
  color: #000;
`
const GroupTitle = styled.div`
  padding: 0.44rem 1.25rem 0;
  p {
    overflow: hidden;
    font-size: 0.94rem;
    line-height: 1.38rem;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
`
const GroupNumber = styled.span`
  font-size: 0.81rem;
  line-height: 1.19rem;
  opacity: 0.5;
`
const SettingBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 4.13rem;
  padding: 1.13rem 0 0.94rem;
  .ant-btn + .ant-btn {
    margin-left: 0.44rem;
  }
`
const SettingButton = styled.button`
  width: 4.75rem;
  height: 4.13rem;
  background-color: transparent;
  border-radius: 0.63rem;
  border: 0;
  font-size: 0.69rem;
  opacity: 0.9;
  cursor: pointer;
  &:hover {
    background-color: #344360;
  }
  &:active,
  &:focus {
    background-color: #081734;
  }
  &+& {
    margin-left: 0.5625rem;
  }
`
const ButtonIcon = styled.span`
  display: block;
  width: 1.5rem;
  height: 1.5rem;
  margin: 0 auto 0.13rem;
  background-repeat: no-repeat;
  background-size: 1.5rem 1.5rem;
  ${props => {
    switch (props.iconimg) {
      case 'name':
        return css`
          background-image: url(${EditIcon});
        `;
      case 'talk':
        return css`
          background-image: url(${TalkIcon});
        `;
      case 'Meeting':
        return css`
          background-image: url(${MeetingIcon});
        `;
    }
  }}
`;
const StypedInput = styled(Input)`
  height: auto;
  padding: 0;
  background-color: transparent;
  border-width: 0 0 1px !important;
  border-radius: 0;
  &:hover,
  &:active,
  &:not(:disabled):focus-within {
    border-color: #fff;
  }
  input {
    font-size: 0.94rem;
  }
  .input-counter {
    font-size: 0.69rem;
    color: #bdc6d3;
  }
`


function RoomInquiryModal({ isEdit }) {

  const [value, setValue] = useState('');
  const [isChanged, setIsChanged] = useState(false);

  const handleChange = text => {
    setValue(text);
    setIsChanged(true);
  };

  const userContent = (
    <>
      <Photos srcList={['a1', 'a2', 'a3', 'a4']} defaultDiameter="3.75" center />
      <GroupTitle>
        {isEdit ? (
          <StypedInput maxLength={20} value={value} onChange={handleChange} />
        ) : (
            <p>디자인방</p>
          )}
      </GroupTitle>
      <GroupNumber>4명</GroupNumber>
      <SettingBox>
        {isEdit ? (
          <>
            <Button type="solid" shape="round">저장</Button>
            <Button type="outlined" shape="round">취소</Button>
          </>
        ) : (
            <>
              <SettingButton>
                <ButtonIcon iconimg="name" />
                이름 변경
              </SettingButton>
              <SettingButton>
                <ButtonIcon iconimg="talk" />
                Talk
              </SettingButton>
              <SettingButton>
                <ButtonIcon iconimg="Meeting" />
                Meeting
              </SettingButton>
            </>
          )}
      </SettingBox>
    </>
  );
  const subContent = (
    <UserList>
      <UserItem>
        <UserImag><img src="" /></UserImag>
        <UserName>이름</UserName>
      </UserItem>
      <UserItem>
        <UserImag><img src="" /></UserImag>
        <UserName>이름</UserName>
      </UserItem>
    </UserList>
  );

  return (
    <ProfileModal
      visible={'visible'}
      footer={null}
      width={'17.5rem'}
      topButton
      userContent={userContent}
      subContent={subContent}
      footer={
        <AddButton>룸 구성원 초대</AddButton>
      }
    />
  );
};

export default RoomInquiryModal;
