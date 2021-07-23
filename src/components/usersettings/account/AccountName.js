import React, { useCallback, useState } from 'react';
import { useCoreStores, Button } from 'teespace-core';
import { useTranslation } from 'react-i18next';
import {
  ContentItem,
  ItemTitle,
  ItemInfo,
  ButtonBox,
  EditNameInput,
} from '../../../styles/usersettings/ContentAccountStyle';
import uiStore from '../../../stores/uiStore';

const AccountName = () => {
  const { t } = useTranslation();
  const { userStore } = useCoreStores();
  const myDomainData = userStore.myDomainSetting;

  const [name, setName] = useState(myDomainData.name);
  const [isNameEdit, setIsNameEdit] = useState(false);

  const handleChangeName = useCallback(async () => {
    try {
      await userStore.updateMyDomainSetting({ name });
      setIsNameEdit(false);
      uiStore.openToast({
        text: t('CM_CHANGE_SAVE'),
        onClose: () => {
          uiStore.closeToast();
        },
      });
    } catch (error) {
      console.log(`changeName Error is ${error}`);
    }
  }, [name, t, userStore]);

  const handleCancelChangeName = () => {
    setIsNameEdit(false);
    setName(myDomainData.name);
  };

  return (
    <ContentItem>
      <ItemTitle>{t('CM_EDIT_MYPAGE_02')}</ItemTitle>
      <ItemInfo>
        {isNameEdit ? (
          <>
            <EditNameInput
              maxLength={20}
              placeholder={myDomainData.name}
              value={name}
              onChange={input => setName(input)}
            />
            <>
              <ButtonBox>
                <Button
                  size="small"
                  type="solid"
                  disabled={myDomainData.name === name}
                  onClick={handleChangeName}
                >
                  {t('CM_SAVE')}
                </Button>
                <Button size="small" onClick={handleCancelChangeName}>
                  {t('CM_CANCEL')}
                </Button>
              </ButtonBox>
            </>
          </>
        ) : (
          <>
            {myDomainData?.name || '-'}
            <ButtonBox>
              <Button size="small" onClick={() => setIsNameEdit(true)}>
                {t('CM_CHANGE')}
              </Button>
            </ButtonBox>
          </>
        )}
      </ItemInfo>
    </ContentItem>
  );
};

export default React.memo(AccountName);
