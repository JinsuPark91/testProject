import React, { useCallback } from 'react';
import { useCoreStores, Button } from 'teespace-core';
import { useTranslation } from 'react-i18next';
import MovePage from '../../utils/MovePage';
import { useStores } from '../../stores';

const SettingSave = ({ onCancel, inputPassword }) => {
  const { t } = useTranslation();
  const { userStore, authStore, spaceStore } = useCoreStores();
  const { uiStore } = useStores();

  const handleToggleMessage = () => {
    const [title, subTitle] = t('CM_INCORRECT_PWD').split('\n');

    uiStore.openMessage({
      title,
      subTitle,
      type: 'error',
      buttons: [
        {
          type: 'solid',
          shape: 'round',
          text: t('CM_LOGIN_POLICY_03'),
          onClick: () => {
            uiStore.closeMessage();
          },
        },
      ],
    });
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

  return (
    <>
      <Button type="solid" onClick={onCancel}>
        {t('CM_BACK')}
      </Button>
      <Button onClick={handleInputPassword} type="outlined">
        {t('CM_LOGIN_POLICY_03')}
      </Button>
    </>
  );
};

export default SettingSave;
