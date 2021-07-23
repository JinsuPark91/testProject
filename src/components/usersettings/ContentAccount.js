import React, { useCallback } from 'react';
import { useCoreStores } from 'teespace-core';
import { useTranslation } from 'react-i18next';
import {
  AccountContent,
  ContentBox,
  ContentItem,
  ItemTitle,
  ItemInfo,
  TextLink,
  ImageBox,
} from '../../styles/usersettings/ContentAccountStyle';
import ContentTitle from './ContentTitle';
import MovePage from '../../utils/MovePage';
import { AccountAdvertise, AccountName, AccountPassword } from './account';

const ContentAccount = () => {
  const { t } = useTranslation();
  const { userStore } = useCoreStores();
  const myDomainData = userStore.myDomainSetting;

  const getDefaultProfilePhoto = () => {
    return userStore.myProfile.defaultPhotoUrl;
  };

  const handleOpenCancel = useCallback(() => {
    MovePage('withdrawal/select-type', true);
  }, []);

  return (
    <>
      <ContentTitle
        title={t('CM_EDIT_MYPAGE_01')}
        subTitle={t('CM_EDIT_MYPAGE_07')}
        attachment={
          <ImageBox>
            <img alt="profile" src={getDefaultProfilePhoto()} />
          </ImageBox>
        }
      />
      <AccountContent>
        <ContentBox>
          <ContentItem>
            <ItemTitle>{t('CM_EDIT_MYPAGE_08')}</ItemTitle>
            <ItemInfo>{myDomainData?.userLoginId}</ItemInfo>
          </ContentItem>
          <AccountName />
          <AccountPassword />
          <ContentItem>
            <ItemTitle>{t('CM_EDIT_MYPAGE_04')}</ItemTitle>
            <ItemInfo>
              {t('CM_EDIT_MYPAGE_05')}
              <TextLink onClick={handleOpenCancel}>
                {t('CM_EDIT_MYPAGE_06')}
              </TextLink>
            </ItemInfo>
          </ContentItem>
        </ContentBox>
        <ContentBox>
          <AccountAdvertise />
        </ContentBox>
      </AccountContent>
    </>
  );
};

export default ContentAccount;
