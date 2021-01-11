import React, { useState } from 'react';
import { useCoreStores, Toast, Chip, Message } from 'teespace-core';
import styled from 'styled-components';
import { Button, Input, Modal } from 'antd';
import { checkEmailValid } from '../../libs/Regex';

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
  padding: 1.13rem 1rem 3.69rem;
`;
const StyledInputBox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.88rem;
`;
const StyledChipBox = styled.div`
  overflow-y: auto;
  height: 9.38rem;
  margin-top: 1rem;
  padding: 0 0 0.38rem 0.38rem;
  background-color: #f5f5fb;
  border: 1px solid #c6ced6;
  border-radius: 0.25rem;
  & > div {
    margin: 0.38rem 0.38rem 0 0;
    vertical-align: top;
  }
`;
const StyledInfoTitle = styled.h3`
  font-size: 0.81rem;
  line-height: 1.19rem;
  color: #000000;
  letter-spacing: 0;
  margin-bottom: 0.38rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
const StyledInfoText = styled.p`
  font-size: 0.75rem;
  line-height: 0.88rem;
  color: #777;
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
  & > span {
    display: flex;
    justify-content: center;
  }
`;

const StyledLinkButton = styled(Button)`
  &.ant-btn {
    height: auto;
    margin-top: 1rem;
    padding: 0;
    font-size: 0.81rem;
    line-height: 1.19rem;
    color: #6c56e5;
    &:hover span {
      text-decoration: underline;
    }
  }
`;

function AddFriendsByInvitationDialog({
  visible,
  onSendInviteMail = () => {}, // 초대 메일 전송해도 초대 다이얼로그 닫히지 않는 것이 현재 기획 - 기획 변경으로 인해 필요없어졌지만 일단 남겨둠
  onCancel,
}) {
  const { friendStore, userStore, spaceStore } = useCoreStores();
  const [mailAddress, setMailAddress] = useState('');
  const [chipList, setChipList] = useState([]);
  const [isToastVisible, setIsToastVisible] = useState(false);
  const [toastText, setToastText] = useState('');
  const [isMessageVisible, setIsMessageVisible] = useState(false);
  const myUserId = userStore.myProfile.id;

  const handleCancel = () => {
    setMailAddress('');
    setChipList([]);
    onCancel();
  };

  const handleToggleToast = () => {
    setIsToastVisible(!isToastVisible);
  };

  const handleToggleMessage = () => {
    setIsMessageVisible(!isMessageVisible);
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

  const handleInput = inputText => {
    let indexNum = 0;
    if (inputText.includes(',') || inputText.includes(';')) {
      indexNum =
        inputText.indexOf(',') !== -1
          ? inputText.indexOf(',')
          : inputText.indexOf(';');
      const addText = inputText.substring(0, indexNum);
      const remainText = inputText.substring(indexNum + 1, inputText.length);
      setMailAddress(remainText);

      const chipsSet = new Set(chipList);
      chipsSet.add(addText);
      setChipList(Array.from(chipsSet));
    } else {
      setMailAddress(inputText);
    }
  };

  const handlePressEnter = () => {
    if (mailAddress.length) {
      const chipsSet = new Set(chipList);
      chipsSet.add(mailAddress);
      setChipList(Array.from(chipsSet));
      setMailAddress('');
    }
  };

  const handleCloseChip = elem => {
    const chipsSet = new Set(chipList);
    chipsSet.delete(elem);
    setChipList(Array.from(chipsSet));
  };

  const handleSendInviteMail = async () => {
    if (!chipList.length && !mailAddress.length) {
      setToastText('초대할 이메일 주소를 1개 이상 입력해 주세요.');
      handleToggleToast();
      return;
    }

    if (mailAddress.length > 0 && !checkEmailValid(mailAddress)) {
      handleToggleMessage();
      return;
    }

    for (let i = 0; i < chipList.length; i += 1) {
      if (!checkEmailValid(chipList[i])) {
        handleToggleMessage();
        return;
      }
    }

    try {
      const sendChipSet = new Set(chipList);
      if (mailAddress.length) {
        sendChipSet.add(mailAddress);
      }

      friendStore.sendInvitationMail({
        myUserId,
        userEmailList: Array.from(sendChipSet),
        domainName: spaceStore.currentSpace?.name,
        userCount: spaceStore.currentSpace?.userCount,
      });

      setMailAddress('');
      setChipList([]);
      setToastText('발송한 초대장은 24시간 이후 만료됩니다.');
      handleToggleToast();
      // onSendInviteMail();
    } catch (e) {
      console.log(`Just Error is ${e}`);
    }
  };

  return (
    <>
      <StyledModal
        visible={visible}
        mask
        maskClosable={false}
        footer={null}
        width="27.5rem"
        title="초대 메일 보내기"
        onCancel={handleCancel}
      >
        <StyledContent>
          <StyledInfoTitle>현재 스페이스로 구성원 초대</StyledInfoTitle>
          <StyledInfoText>
            입력한 이메일 주소로 초대장이 발송됩니다.
            <br />
            초대받은 구성원의 참여 완료 시, 나의 프렌즈 목록에 추가됩니다.
          </StyledInfoText>
          <StyledInputBox onInput={e => handleInput(e.target.value)}>
            <StyledInput
              onPressEnter={handlePressEnter}
              placeholder="이메일 주소 추가"
              maxLength="200"
              value={mailAddress}
              autoFocus
            />
            <StyledButton shape="round" onClick={handleSendInviteMail}>
              보내기
            </StyledButton>
          </StyledInputBox>
          {chipList.length ? (
            <StyledChipBox>
              {chipList.map(elem => (
                <Chip
                  size="small"
                  text={elem}
                  key={elem}
                  onClose={() => handleCloseChip(elem)}
                  alert={!checkEmailValid(elem) ? 1 : undefined}
                />
              ))}
            </StyledChipBox>
          ) : null}
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
        <Message
          visible={isMessageVisible}
          title="올바르지 않은 이메일 주소 형식이 포함되어 있습니다."
          subtitle="오류 표시된 주소를 수정하거나 삭제 후 초대 메일을 보내주세요."
          type="error"
          btns={[
            {
              type: 'solid',
              shape: 'round',
              text: '확인',
              onClick: handleToggleMessage,
            },
          ]}
        />
      </StyledModal>
    </>
  );
}

export default AddFriendsByInvitationDialog;
