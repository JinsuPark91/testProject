import React, { useState, useRef } from 'react';
import { useCoreStores, Input } from 'teespace-core';
import { useTranslation } from 'react-i18next';
import { Checkbox } from 'antd';
import ContentTitle from './ContentTitle';
import {
  ContentGroup,
  GroupTitle,
  GroupTitleBlack,
  NoticeList,
  NoticeItem,
  SpaceBox,
  SpaceLogo,
  SpaceTitle,
  SpaceInfo,
  CheckboxWrap,
  StyledButton,
  InputWrap,
  InputName,
} from '../../styles/usersettings/ContentSpaceSecessionStyle';

const ContentSpaceSecession = ({
  isSecession,
  toggleSecession,
  onInputChange,
}) => {
  const { t } = useTranslation();
  const { spaceStore } = useCoreStores();
  const [checked, setChecked] = useState(false);
  const inputRef = useRef(null);

  const handleToggleSecession = () => {
    toggleSecession();
    setChecked(false);
    setTimeout(() => {
      if (inputRef.current) inputRef.current.focus();
    }, 1);
  };

  return (
    <>
      <ContentTitle
        title={t('CM_SETTING_DELETE_SPACE_01')}
        subTitle={t('CM_SETTING_DELETE_SPACE_02')}
      />
      <ContentGroup>
        <GroupTitle>{t('CM_SETTING_DELETE_SPACE_03')}</GroupTitle>
        <SpaceBox>
          <SpaceLogo
            shape="square"
            style={{ color: '#fff', backgroundColor: '#75757F' }}
          >
            {spaceStore.currentSpace?.name[0]}
          </SpaceLogo>
          <SpaceInfo>
            <SpaceTitle>{spaceStore.currentSpace?.name}</SpaceTitle>
            {spaceStore.currentSpace?.domain}
          </SpaceInfo>
        </SpaceBox>
      </ContentGroup>
      <ContentGroup>
        {isSecession ? (
          <>
            <GroupTitleBlack>{t('CM_SETTING_DELETE_SPACE_08')}</GroupTitleBlack>
            <InputWrap>
              <InputName htmlFor="password">{t('CM_PWD')}</InputName>
              <Input
                id="password"
                type="password"
                onChange={e => onInputChange(e.target.value)}
                ref={inputRef}
              />
            </InputWrap>
          </>
        ) : (
          <>
            <GroupTitle>{t('CM_SETTING_DELETE_SPACE_04')}</GroupTitle>
            <NoticeList>
              <NoticeItem>{t('CM_SETTING_DELETE_SPACE_05')}</NoticeItem>
              <NoticeItem>{t('CM_SETTING_DELETE_SPACE_06')}</NoticeItem>
            </NoticeList>
            <CheckboxWrap>
              <Checkbox
                className="check-round"
                onChange={() => setChecked(!checked)}
              >
                {t('CM_ALL_READ_AGREE_POLICY')}
              </Checkbox>
            </CheckboxWrap>
            <StyledButton
              type={checked ? 'solid' : 'outlined'}
              disabled={!checked}
              onClick={handleToggleSecession}
            >
              {t('CM_SETTING_DELETE_SPACE_07')}
            </StyledButton>
          </>
        )}
      </ContentGroup>
    </>
  );
};

export default ContentSpaceSecession;
