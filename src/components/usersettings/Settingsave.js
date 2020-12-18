import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { useObserver } from 'mobx-react';
import { useCoreStores, Toast, Message, Button } from 'teespace-core';
import { useHistory } from 'react-router-dom';

import { useStore } from '../../stores';

function Settingsave(props) {
  const [cancelVisible, setCancelVisible] = useState(false);
  const [savevisible, setsavevisible] = useState(false);
  const [isMessageOpen, setIsMessageOpen] = useState(false);
  const { userStore, authStore, spaceStore } = useCoreStores();
  const { form, onClick, selectedKey } = props;
  const history = useHistory();

  const saveOut = props => {
    if (selectedKey === '3') props.saveaccountOut();

    if (selectedKey === '6') props.savepasswordOut();
  };

  const saveChange = props => {
    if (selectedKey === '3') props.saveaccountChange();

    if (selectedKey === '6') props.savepasswordChange();
  };

  const handleToggleMessage = () => {
    setIsMessageOpen(!isMessageOpen);
  };

  const handleMoveSpacePage = useCallback(() => {
    const url = window.location.href;
    const purl = url?.split('.');
    if (
      purl[0].match('127') ||
      purl[0].match('192') ||
      purl[0].match('local')
    ) {
      window.location.href = `${window.location.protocol}//dev.wapl.ai/spaces`;
    } else {
      const tdomain = purl[1];
      if (purl[1] === 'wapl') {
        window.location.href = `${window.location.protocol}//wapl.ai/spaces`;
      } else {
        window.location.href = `${window.location.protocol}//${tdomain}wapl.ai/spaces`;
      }
    }
  }, []);

  const handleInputPassword = async () => {
    const input = props.inputPassword;
    const res = await authStore.checkAuth({
      loginId: userStore.myProfile.id,
      pw: input,
    });

    if (!res) {
      handleToggleMessage();
    } else {
      await spaceStore.deleteSpace({
        id: spaceStore.currentSpace.id,
      });
      handleMoveSpacePage();
    }
  };

  return (
    <>
      <Button
        type="solid"
        onClick={() => {
          props.toggleContinue();
          props.toggleFooter();
          props.toggleCheck();
          // setsavevisible(true);
          // form.current.submit();
          // saveChange(props);
        }}
      >
        이전
      </Button>
      <Toast
        visible={savevisible}
        timeoutMs={3000}
        onClose={() => setsavevisible(false)}
      >
        {' '}
        변경사항이 저장되었습니다.
      </Toast>

      <Button onClick={handleInputPassword} type="outlined">
        확인
      </Button>
      <Message
        visible={cancelVisible}
        type="error"
        btns={[
          {
            onClick: () => {
              saveOut(props);
            },
            text: '나가기',
            type: 'solid',
            shape: 'round',
          },
          {
            onClick: () => {
              setCancelVisible(false);
            },
            text: '취소',
            type: 'outlined',
            shape: 'round',
          },
        ]}
        title="변경 사항을 저장하지 않고 나가시겠습니까?"
      />
      <Message
        visible={isMessageOpen}
        title="입력하신 비밀번호가 올바르지 않습니다."
        subtitle="비밀번호를 다시 확인해 주세요."
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
    </>
  );
}

export default Settingsave;
