import React from 'react';
import { useCoreStores, Input } from 'teespace-core';
import { useTranslation } from 'react-i18next';
import { Button, Checkbox, Avatar } from 'antd';
import styled from 'styled-components';
import ContentTitle from './ContentTitle';

const ContentGroup = styled.div`
  padding: 0.25rem 0 1.25rem;
  border-top: 1px solid #d8d8d8;
  &:first-of-type {
    margin-top: 1.25rem;
  }
`;

const GroupTitle = styled.p`
  margin-bottom: 1.25rem;
  font-size: 0.75rem;
  line-height: 1.13rem;
  color: #777;
`;

const GroupTitleBlack = styled(GroupTitle)`
  margin-bottom: 0.88rem;
  font-size: 0.81rem;
  font-weight: 500;
  line-height: 1.19rem;
  color: #000;
`;

const NoticeList = styled.ul``;
const NoticeItem = styled.li`
  position: relative;
  padding-left: 0.875rem;
  font-size: 0.75rem;
  line-height: 1.23rem;
  color: #4a4a4a;
  white-space: pre-line;
  & + & {
    margin-top: 0.63rem;
  }
  &:before {
    content: '';
    position: absolute;
    top: 0.875rem;
    left: 0.3125rem;
    width: 0.1875rem;
    height: 0.1875rem;
    background-color: #4a4a4a;
    border-radius: 50%;
  }
`;

const SpaceBox = styled.div`
  display: flex;
  align-items: center;
`;

const SpaceLogo = styled(Avatar)`
  flex-shrink: 0;
  width: 2.38rem;
  height: 2.38rem;
  font-size: 1.13rem;
  line-height: 2.38rem;
  font-weight: 500;
  border-radius: 0.5rem;
`;

const SpaceTitle = styled.strong`
  overflow: hidden;
  display: block;
  font-size: 0.88rem;
  line-height: 1.125rem;
  font-weight: 500;
  color: #000;
  text-overflow: ellipsis;
`;

const SpaceInfo = styled.p`
  overflow: hidden;
  margin-left: 0.63rem;
  font-size: 0.69rem;
  line-height: 0.875rem;
  color: #777;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const CheckboxWrap = styled.div`
  padding: 1.25rem 0 1.44rem;
  .ant-checkbox-wrapper > span {
    vertical-align: middle;
  }
  .ant-checkbox + span {
    padding: 0 0.31rem;
    font-size: 0.75rem;
    font-weight: 500;
    line-height: 1.13rem;
    color: #000;
  }
`;

const StyledButton = styled(Button)`
  padding: 0 0.78rem;
  &.ant-btn {
    width: 4.5rem;
    height: 1.88rem;
    font-size: 0.75rem;
    color: #fff;
    text-align: center;
  }
`;

const InputWrap = styled.div`
  display: flex;
  align-items: center;
  .ant-input {
    width: 15.63rem;
  }
`;

const InputName = styled.label`
  margin-right: 0.63rem;
  margin-bottom: 0rem;
  font-size: 0.81rem;
  color: #000;
`;

function ContentSpaceSecession({
  isContinue,
  toggleContinue,
  isCheck,
  toggleCheck,
  handleInputPassword,
}) {
  // constructor() {
  //   super();
  //   this.state = {
  //     checked: false,
  //   };
  //   this.handleChange = this.handleChange.bind(this);
  // }
  // handleChange(checked) {
  //   this.setState({ checked });
  // }
  const { t } = useTranslation();
  const { spaceStore } = useCoreStores();

  const handlePasswordInput = inputText => {
    handleInputPassword(inputText);
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
        {isContinue ? (
          <>
            <GroupTitleBlack>{t('CM_SETTING_DELETE_SPACE_08')}</GroupTitleBlack>
            <InputWrap>
              <InputName htmlFor="password">{t('CM_PWD')}</InputName>
              <Input
                id="password"
                type="password"
                onChange={e => handlePasswordInput(e.target.value)}
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
                // handleButtonDisabled={value => setChecked(value)}
                onChange={toggleCheck}
              >
                {t('CM_ALL_READ_AGREE_POLICY')}
              </Checkbox>
            </CheckboxWrap>
            <StyledButton
              type={isCheck ? 'solid' : 'outlined'}
              disabled={!isCheck}
              onClick={toggleContinue}
            >
              {t('CM_SETTING_DELETE_SPACE_07')}
            </StyledButton>
          </>
        )}
      </ContentGroup>
    </>
  );
}

export default ContentSpaceSecession;
