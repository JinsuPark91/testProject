import React, { useEffect, useState } from 'react';
import { Tooltip } from 'antd';
import { useTranslation } from 'react-i18next';
import {
  SubTitle,
  NameInputBox,
  ErrorIcon,
} from '../../../styles/profile/SpaceEditModalStyle';
import errorIcon from '../../../assets/ts_error.svg';

const GroupNameField = ({ spaceName, handleChange }) => {
  const { t } = useTranslation();
  const [isNameWarningVisible, setIsNameWarningVisible] = useState(false);

  const handleChangeName = event => {
    if (isNameWarningVisible) setIsNameWarningVisible(false);
    const targetText = event.target.value;
    handleChange(targetText);
  };

  const handleBlurName = () => {
    if (!spaceName) setIsNameWarningVisible(true);
  };

  useEffect(() => {
    return () => setIsNameWarningVisible(false);
  }, []);

  return (
    <>
      <SubTitle>{t('CM_SPACE_NAME')}</SubTitle>
      <NameInputBox>
        <input
          //   ref={inputRef}
          placeholder={t('CM_COMPANY_GROUP_MEETING_NAME')}
          value={spaceName}
          onChange={handleChangeName}
          onBlur={handleBlurName}
          maxLength={30}
          autoFocus
        />
        <ErrorIcon visible={isNameWarningVisible}>
          <Tooltip
            title={t('CM_ENTER_SPACE_NAME')}
            color="#4C535D"
            placement="top"
            visible={isNameWarningVisible}
          >
            <img alt="error" src={errorIcon} />
          </Tooltip>
        </ErrorIcon>
      </NameInputBox>
    </>
  );
};

export default React.memo(GroupNameField);
