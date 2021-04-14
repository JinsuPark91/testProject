import React, { useState } from 'react';
import { useCoreStores, Toast, Chip, Message, logEvent } from 'teespace-core';
import { useTranslation } from 'react-i18next';
import { checkEmailValid } from '../../libs/Regex';
import {
  StyledModal,
  StyledContent,
  StyledInputBox,
  StyledChipBox,
  StyledInfoTitle,
  StyledInfoText,
  StyledInput,
  StyledLinkButton,
  SendButton,
} from '../../styles/addfriends/AddFriendsByInvitationDialogStyle';
import sendMailIcon from '../../assets/invite_send.svg';

const AddFriendsByInvitationDialog = ({ onCancel }) => {
  const { t } = useTranslation();
  const { friendStore, userStore, spaceStore } = useCoreStores();
  const [mailAddress, setMailAddress] = useState('');
  const [chipList, setChipList] = useState([]);
  const [isToastVisible, setIsToastVisible] = useState(false);
  const [toastText, setToastText] = useState('');
  const [isMessageVisible, setIsMessageVisible] = useState(false);
  const myUserId = userStore.myProfile.id;

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

    const isChipInvalid = chipList.find(
      elem => checkEmailValid(elem) === false,
    );
    const isInputInvalid =
      mailAddress.length > 0 && !checkEmailValid(mailAddress);

    if (isChipInvalid || isInputInvalid) {
      handleToggleMessage();
      return;
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
    } catch (e) {
      console.log(`Invitation Error... ${e}`);
    }
  };

  return (
    <>
      <StyledModal
        visible
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
          {chipList.length > 0 && (
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
          )}
          <StyledLinkButton type="link" onClick={handleCopyInviteLink}>
            {t('CM_INVITE_PEOPLE_POPUP_04')}
          </StyledLinkButton>
        </StyledContent>
      </StyledModal>
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
};

export default AddFriendsByInvitationDialog;
