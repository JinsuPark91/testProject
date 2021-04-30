import React, { useState, useCallback } from 'react';
import { useCoreStores, Message, Button } from 'teespace-core';
import { useTranslation } from 'react-i18next';
import MovePage from '../../utils/MovePage';

const SettingSave = ({ onCancel, inputPassword }) => {
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
    const passwordInput = inputPassword;
    const res = await authStore.validatePassword({
      pw: passwordInput,
    });

    if (!res) handleToggleMessage();
    else {
      await spaceStore.leaveCurrentSpace({
        userId: userStore.myProfile.id,
      });
      handleMoveSpacePage();
    }
  };

  const title = t('CM_INCORRECT_PWD').split('\n');

  return (
    <>
      <Button type="solid" onClick={onCancel}>
        {t('CM_BACK')}
      </Button>
      <Button onClick={handleInputPassword} type="outlined">
        {t('CM_LOGIN_POLICY_03')}
      </Button>
      {isMessageOpen && (
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
      )}
    </>
  );
};

export default SettingSave;
