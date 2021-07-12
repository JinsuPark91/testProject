import React, { useContext } from 'react';
import { Tooltip } from 'antd'; // 사라지지 않게 하기 위해 antd 적용
import { useTranslation } from 'react-i18next';
import { ThemeContext } from 'styled-components';
import { isBasicPlan } from '../../../utils/GeneralUtil';
import { getMainURL } from '../../../utils/UrlUtil';
import {
  SubTitle,
  UrlInputBox,
  ErrorIcon,
  UrlText,
} from '../../../styles/profile/SpaceEditModalStyle';
import errorIcon from '../../../assets/ts_error.svg';

const GroupNameField = ({
  urlAddress,
  handleChange,
  handleBlur,
  warningVisible,
  warningText,
}) => {
  const { t } = useTranslation();
  const themeContext = useContext(ThemeContext);
  return (
    <>
      <SubTitle>URL</SubTitle>
      {isBasicPlan() ? (
        <Tooltip
          title={t('CM_PROFILE_SPACE_BASIC')}
          placement="bottomLeft"
          color={themeContext.CoreLight}
        >
          <UrlInputBox disabled>
            <input value={urlAddress} disabled />
            <UrlText>{getMainURL()}</UrlText>
          </UrlInputBox>
        </Tooltip>
      ) : (
        <UrlInputBox>
          <input
            value={urlAddress}
            onChange={handleChange}
            onBlur={handleBlur}
            maxLength={200}
          />
          <ErrorIcon visible={warningVisible}>
            <Tooltip
              title={warningText}
              color={themeContext.CoreLight}
              placement="top"
              visible={warningVisible}
            >
              <img alt="error" src={errorIcon} />
            </Tooltip>
          </ErrorIcon>
          <UrlText>{getMainURL()}</UrlText>
        </UrlInputBox>
      )}
    </>
  );
};

export default React.memo(GroupNameField);
