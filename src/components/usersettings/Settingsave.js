import React, { useState, useCallback } from 'react';
import { useCoreStores, Message, Button } from 'teespace-core';
import { useTranslation } from 'react-i18next';
import MovePage from '../../utils/MovePage';

const Settingsave = props => {
  const { t } = useTranslation();
  const [isMessageOpen, setIsMessageOpen] = useState(false);
  const { userStore, authStore, spaceStore } = useCoreStores();

  const handleToggleMessage = () => {
    setIsMessageOpen(!isMessageOpen);
  };

  const handleMoveSpacePage = useCallback(() => {
    MovePage('spaces');
  }, []);

  const handleInputPassword = async () => {
    const passwordInput = props.inputPassword;
    const res = await authStore.validatePassword({
      pw: passwordInput,
    });

    if (!res) {
      handleToggleMessage();
    } else {
      await spaceStore.leaveCurrentSpace({
        userId: userStore.myProfile.id,
      });
      handleMoveSpacePage();
    }
  };

  const title = t('CM_INCORRECT_PWD').split('\n');

  return (
    <>
      <Button
        type="solid"
        onClick={() => {
          props.toggleContinue();
          props.toggleFooter();
          props.toggleCheck();
        }}
      >
        {t('CM_BACK')}
      </Button>
      <Button onClick={handleInputPassword} type="outlined">
        확인
      </Button>
      <Message
        visible={isMessageOpen}
        title={title[0]}
        subtitle={title[1]}
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
    </>
  );
};

export default Settingsave;
