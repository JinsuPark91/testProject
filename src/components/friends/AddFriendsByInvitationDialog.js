import React, { useState } from 'react';
import { useCoreStores, Toast } from 'teespace-core';
import styled from 'styled-components';
import { Button, Input, Modal } from 'antd';

const StyledModal = styled(Modal)`
  .ant-modal-body {
    padding: 0;
  }
  .ant-modal-header {
    padding: 0.69rem 0 0.75rem;
  }
  .ant-modal-title {
    font-size: 0.88rem;
    line-height: 1.25rem;
    color: #000000;
    letter-spacing: 0;
  }
`;
const StyledContent = styled.div`
  padding: 1.25rem 1.25rem 1.44rem;
`;
const StyledInputBox = styled.div`
  display: flex;
  justify-content: space-between;
  aligin-item: center;
  margin-top: 0.69rem;
`;
const StyledInfoTitle = styled.h3`
  font-size: 0.81rem;
  line-height: 1.19rem;
  color: #000000;
  letter-spacing: 0;
  margin-bottom: 0.19rem;
`;
const StyledInfoText = styled.p`
  font-size: 0.69rem;
  line-height: 1.06rem;
  color: #8d8d8d;
  letter-spacing: 0;
`;

const StyledInput = styled(Input)`
  margin-right: 0.5rem;
`;

const StyledButton = styled(Button)`
  width: 4.38rem;
  padding: 0 1.13rem;
  background-color: #6c56e5;
  color: #fff;
  border-color: #6c56e5;
`;

const StyledLinkButton = styled(Button)`
  margin-top: 0.19rem;
  padding: 0;
  border: 0;
  height: 1.06rem;
  font-size: 0.69rem;
  line-height: 1.06rem;
  color: #6c56e5;
  &:hover,
  &:foucs,
  &:active {
    border: 0;
  }
  & span {
    text-decoration: underline;
  }
`;

function AddFriendsBySearch({ visible, onCancel }) {
  const { friendStore, userStore } = useCoreStores();
  const [mailAddress, setMailAddress] = useState('');
  const [isToastVisible, setIsToastVisible] = useState(false);
  const [toastText, setToastText] = useState('');
  const myUserId = userStore.myProfile.id;

  const handleCancel = () => {
    onCancel();
  };

  const handleToggleToast = () => {
    setIsToastVisible(!isToastVisible);
  };

  const handleSendInviteMail = async () => {
    try {
      // 서비스 완성 후 테스트
      // const mailArr = mailAddress.split(' ');
      // const response = await friendStore.sendInvitationMail({
      //   myUserId,
      //   userEmailList: mailArr,
      //   domainName: ,
      //   userCount: ,
      // });
      // console.log(response);

      setToastText('발송한 초대장은 24시간 이후 만료됩니다.');
      handleToggleToast();
      onCancel();
    } catch (e) {
      console.log(`Just Error is ${e}`);
    }
  };

  const handleCopyInviteLink = async () => {
    try {
      const response = await friendStore.fetchUserInvitationLink({
        myUserId,
      });
      const el = document.createElement('textarea');
      el.value = response;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);

      setToastText('복사한 초대 링크는 24시간 이후 만료됩니다.');
      handleToggleToast();
    } catch (e) {
      console.log('Copy Error...');
    }
  };

  return (
    <>
      <StyledModal
        visible={visible}
        mask={false}
        footer={null}
        width="24.38rem"
        title="초대 메일 보내기"
        onCancel={handleCancel}
      >
        <StyledContent>
          <StyledInfoTitle>UX팀(으)로 구성원 초대</StyledInfoTitle>
          <StyledInfoText>
            입력한 이메일 주소로 초대장이 방송됩니다.
            <br />
            초대받은 구성원의 참여 완료 시, 나의 프렌즈 목록에 추가됩니다.
          </StyledInfoText>
          <StyledInputBox onInput={e => setMailAddress(e.target.value)}>
            <StyledInput placeholder="이메일 주소 추가" />
            <StyledButton shape="round" onClick={handleSendInviteMail}>
              보내기
            </StyledButton>
          </StyledInputBox>

          <StyledLinkButton type="link" onClick={handleCopyInviteLink}>
            초대 링크 복사
          </StyledLinkButton>
        </StyledContent>
        <Toast
          visible={isToastVisible}
          timeoutMs={1000}
          onClose={() => {
            setIsToastVisible(false);
          }}
        >
          {toastText}
        </Toast>
      </StyledModal>
    </>
  );
}

export default AddFriendsBySearch;
