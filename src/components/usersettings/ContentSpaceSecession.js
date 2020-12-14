import React, { useState } from 'react';
import { Button, Checkbox, Avatar } from 'antd';
import { Input } from 'teespace-core';
import styled from 'styled-components';
import ContentTitle from './ContentTitle';
import PlatformUIStore from '../../stores/PlatformUIStore';

const ContentGroup = styled.div`
  padding: 0.25rem 0 1.25rem;
  border-top: 1px solid #d8d8d8;
  &:first-of-type {
    margin-top: 1.25rem;
  }
`;
const GroupTitle = styled.p`
  margin-bottom: 1.25rem;
  font-size: 0.75rem;
  line-height: 1.13rem;
  color: #777;
`;
const GroupTitleBlack = styled(GroupTitle)`
  margin-bottom: 0.88rem;
  font-size: 0.81rem;
  font-weight: 500;
  line-height: 1.19rem;
  color: #000;
`;
const NoticeList = styled.ul``;
const NoticeItem = styled.li`
  position: relative;
  padding-left: 0.875rem;
  font-size: 0.75rem;
  line-height: 1.13rem;
  color: #4a4a4a;
  & + & {
    margin-top: 0.63rem;
  }
  &:before {
    content: '';
    position: absolute;
    top: 0.875rem;
    left: 0.3125rem;
    width: 0.1875rem;
    height: 0.1875rem;
    background-color: #4a4a4a;
    border-radius: 50%;
  }
`;
const SpaceBox = styled.div`
  display: flex;
  align-items: center;
`;
const SpaceLogo = styled(Avatar)`
  flex-shrink: 0;
  width: 2.38rem;
  height: 2.38rem;
  font-size: 1.13rem;
  line-height: 2.38rem;
  font-weight: 500;
  border-radius: 0.5rem;
`;
const SpaceTitle = styled.strong`
  overflow: hidden;
  display: block;
  font-size: 0.88rem;
  line-height: 1.125rem;
  font-weight: 500;
  color: #000;
  text-overflow: ellipsis;
`;
const SpaceInfo = styled.p`
  overflow: hidden;
  margin-left: 0.63rem;
  font-size: 0.69rem;
  line-height: 0.875rem;
  color: #777;
  white-space: nowrap;
  text-overflow: ellipsis;
`;
const CheckboxWrap = styled.div`
  padding: 1.25rem 0 1.44rem;
  .ant-checkbox-wrapper > span {
    vertical-align: middle;
  }
  .ant-checkbox + span {
    padding: 0 0.31rem;
    font-size: 0.75rem;
    font-weight: 500;
    line-height: 1.13rem;
    color: #000;
  }
`;
const StyledButton = styled(Button)`
  padding: 0 0.78rem;
`;
const InputWrap = styled.div`
  display: flex;
  align-items: center;
  .ant-input {
    width: 15.63rem;
  }
`;
const InputName = styled.label`
  margin-right: 0.63rem;
  font-size: 0.81rem;
  color: #000;
`;

function onChange(e) {
  console.log('checked = ${e.target.checked}');
}

function ContentSpaceSecession({
  isContinue,
  toggleContinue,
  isCheck,
  toggleCheck,
  handleInputPassword,
}) {
  // constructor() {
  //   super();
  //   this.state = {
  //     checked: false,
  //   };
  //   this.handleChange = this.handleChange.bind(this);
  // }
  // handleChange(checked) {
  //   this.setState({ checked });
  // }

  const handlePasswordInput = inputText => {
    handleInputPassword(inputText);
  };

  return (
    <>
      <ContentTitle
        title="스페이스 탈퇴"
        subTitle="스페이스 탈퇴에 대한 유의사항을 꼭 확인해 주세요."
      />
      <ContentGroup>
        <GroupTitle>현재 스페이스</GroupTitle>
        <SpaceBox>
          <SpaceLogo
            shape="square"
            style={{ color: '#fff', backgroundColor: '#75757F' }}
          >
            U
          </SpaceLogo>
          <SpaceInfo>
            <SpaceTitle>{PlatformUIStore.space?.name}</SpaceTitle>
            {PlatformUIStore.space?.fullDomain}
          </SpaceInfo>
        </SpaceBox>
      </ContentGroup>
      <ContentGroup>
        {isContinue ? (
          <>
            <GroupTitleBlack>
              정말로 탈퇴를 원하시면 계정 비밀번호를 입력해 주세요.
            </GroupTitleBlack>
            <InputWrap>
              <InputName for="password">비밀번호</InputName>
              <Input
                id="password"
                type="password"
                onChange={e => handlePasswordInput(e.target.value)}
              />
            </InputWrap>
          </>
        ) : (
          <>
            <GroupTitle>탈퇴 전 유의 사항</GroupTitle>
            <NoticeList>
              <NoticeItem>
                현재 스페이스의 프로필, 별명 및 비밀번호,
                <br />
                그리고 보관 중인 메일 등 개인형 서비스 이용기록은 모두 삭제되며,
                복구가 불가능합니다.
              </NoticeItem>
              <NoticeItem>
                참여 중인 모든 룸에서 나가게 되고, 룸에서 주고받은 사진이나 파일
                등 모든 데이터에 접근할 수 없게 됩니다.
                <br />
                단, 남아 있는 멤버들은 회원님이 남긴 메시지나 파일에 계속해서
                접근할 수 있습니다.
                <br />
                중요한 데이터는 스페이스 탈퇴 전에 삭제하거나 백업해 주세요.
              </NoticeItem>
            </NoticeList>
            <CheckboxWrap>
              <Checkbox
                className="check-round"
                // handleButtonDisabled={value => setChecked(value)}
                onChange={toggleCheck}
              >
                유의 사항을 모두 확인하였으며, 이에 동의합니다.
              </Checkbox>
            </CheckboxWrap>
            <StyledButton
              shape="round"
              disabled={!isCheck}
              onClick={toggleContinue}
            >
              탈퇴 계속
            </StyledButton>
          </>
        )}
      </ContentGroup>
    </>
  );
}

export default ContentSpaceSecession;
