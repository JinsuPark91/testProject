import React, { useEffect, useState } from 'react';
import { useCoreStores, Toast, Chip, Message, logEvent } from 'teespace-core';
import styled from 'styled-components';
import { Button, Input, Modal } from 'antd';
import { useTranslation } from 'react-i18next';
import sendMailIcon from '../../assets/invite_send.svg';
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
  padding: 1.13rem 1rem 1.44rem;
`;

const StyledInputBox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.88rem;
`;

const StyledChipBox = styled.div`
  overflow-y: auto;
  height: 5.2rem;
  margin-top: 0.56rem;
  padding: 0 0 0.38rem 0.38rem;
  background-color: white;
  border: 0.06rem solid #d0ccc7;
  border-radius: 0.25rem;
  & > div {
    margin: 0.25rem 0.38rem 0 0;
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
  line-height: 0.91rem;
  color: #777;
  letter-spacing: 0;
  white-space: pre-line;
`;

const StyledInput = styled(Input)`
  margin-right: 0.5rem;
`;

const StyledLinkButton = styled(Button)`
  &.ant-btn {
    height: auto;
    margin-top: 1rem;
    padding: 0;
    font-size: 0.81rem;
    line-height: 1.19rem;
    color: #00493d;
    &:hover span {
      text-decoration: underline;
    }
  }
`;

const SendButton = styled.button`
  height: 1.88rem;
  width: 1.88rem;
  line-height: 0;
  background-color: #f7f4ef;
  border-radius: 0.38rem;
  border: none;
  &:hover {
    background-color: #ebe6df;
  }
  &:active {
    background-color: #ddd7cd;
  }
  img {
    width: 1.08rem;
  }
`;

function AddFriendsByInvitationDialog({
  visible,
  onSendInviteMail = () => {},
  onCancel,
}) {
  const { t } = useTranslation();
  const { friendStore, userStore, spaceStore } = useCoreStores();
  const [mailAddress, setMailAddress] = useState('');
  const [chipList, setChipList] = useState([]);
  const [isToastVisible, setIsToastVisible] = useState(false);
  const [toastText, setToastText] = useState('');
  const [isMessageVisible, setIsMessageVisible] = useState(false);
  const myUserId = userStore.myProfile.id;

  useEffect(() => {
    setMailAddress('');
    setChipList([]);
  }, [visible]);

  const handleCancel = () => {
    if (isMessageVisible) {
      setIsMessageVisible(false);
    } else {
      onCancel();
    }
  };

  const handleToggleToast = () => {
    setIsToastVisible(!isToastVisible);
  };

  const handleToggleMessage = () => {
    setIsMessageVisible(!isMessageVisible);
  };

  const handleCopyInviteLink = async () => {
    try {
      const response = await friendStore.fetchSpaceInvitationLink({
        myUserId,
        grade: 'member',
      });
      const el = document.createElement('textarea');
      el.value = response;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setToastText(t('CM_INVITE_PEOPLE_POPUP_05'));
      handleToggleToast();
      logEvent('member', 'clickCopyInvitationLinkBtn');
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
      setToastText(t('CM_INVITE_PEOPLE_POPUP_06'));
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

      friendStore.sendSpaceInvitationMail({
        myUserId,
        userEmailList: Array.from(sendChipSet),
        domainName: spaceStore.currentSpace?.name,
        userCount: spaceStore.currentSpace?.userCount,
      });

      setMailAddress('');
      setChipList([]);
      setToastText(t('CM_INVITE_PEOPLE_POPUP_07'));
      handleToggleToast();
      logEvent('member', 'clickSendInvitationBtn');
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
        maskTransitionName=""
        centered
        maskClosable={false}
        footer={null}
        width="24.38rem"
        title={t('CM_CMD_RESPONSE_RESULT_04')}
        onCancel={handleCancel}
      >
        <StyledContent>
          <StyledInfoTitle>
            {t('CM_INVITE_PEOPLE_POPUP_02', {
              name: spaceStore.currentSpace?.name,
            })}
          </StyledInfoTitle>
          <StyledInfoText>{t('CM_INVITE_PEOPLE_POPUP_03')}</StyledInfoText>
          <StyledInputBox onInput={e => handleInput(e.target.value)}>
            <StyledInput
              onPressEnter={handlePressEnter}
              placeholder={t('CM_EMAIL_ADD')}
              maxLength="200"
              value={mailAddress}
              autoFocus
            />
            <SendButton onClick={handleSendInviteMail}>
              <img alt="send" src={sendMailIcon} />
            </SendButton>
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
            {t('CM_INVITE_PEOPLE_POPUP_04')}
          </StyledLinkButton>
        </StyledContent>
        <Message
          visible={isMessageVisible}
          title={t('CM_INVITE_PEOPLE_POPUP_08')}
          subtitle={t('CM_INVITE_PEOPLE_POPUP_09')}
          type="error"
          btns={[
            {
              type: 'solid',
              shape: 'round',
              text: t('CM_LOGIN_POLICY_03'),
              onClick: handleToggleMessage,
            },
          ]}
        />
      </StyledModal>
      <Toast
        visible={isToastVisible}
        timeoutMs={1000}
        onClose={() => {
          setIsToastVisible(false);
        }}
      >
        {toastText}
      </Toast>
    </>
  );
}

export default AddFriendsByInvitationDialog;
