import React, { useState } from 'react';
import { Button, Select } from 'antd';
import { useCoreStores } from 'teespace-core';
import { useTranslation } from 'react-i18next';
import countryData from 'country-data';
import { getProfileEditDto } from '../../../utils/ProfileUtil';
import {
  InnerItem,
  Name,
  Data,
  TextArea,
  ButtonArea,
} from '../../../styles/usersettings/SettingDialogStyle';

const SettingDialogCountryCode = () => {
  const { t } = useTranslation();
  const { userStore } = useCoreStores();
  const { myProfile } = userStore;
  const [selectedCountryCode, setSelectedCountryCode] = useState(
    myProfile.nationalCode,
  );
  const [isCountryCodeEdit, setIsCountryCodeEdit] = useState(false);
  const { Option } = Select;

  // 국가 번호가 있는 국가를 알파벳 순으로 정렬하자
  const countryDataArray = countryData.countries?.all
    .filter(elem => elem.countryCallingCodes?.length > 0)
    .sort((a, b) => {
      if (a.name > b.name) return 1;
      if (a.name < b.name) return -1;
      return 0;
    });

  const defaultCountry = myProfile.nationalCode
    ? countryDataArray.find(
        elem => elem.countryCallingCodes[0] === myProfile.nationalCode,
      )
    : null;

  const getTextFormat = item => {
    return item ? `${item.countryCallingCodes[0] || ''} ${item.name}` : '-';
  };
  const handleChange = value => {
    setSelectedCountryCode(value.split(' ')[0]);
  };

  const handleSuccess = async () => {
    const updateInfo = getProfileEditDto({
      nationalCode: selectedCountryCode,
    });
    try {
      await userStore.updateMyProfile(updateInfo);
      setIsCountryCodeEdit(false);
    } catch (e) {
      console.log(`change National Code Error is ${e}`);
    }
  };
  const handleCancelChange = () => {
    setIsCountryCodeEdit(false);
    setSelectedCountryCode(myProfile.nationalCode);
  };

  return (
    <InnerItem>
      <Name>{t('CM_COUNTRY_NUMBER')}</Name>
      <Data>
        <TextArea>
          {isCountryCodeEdit ? (
            <Select
              defaultValue={getTextFormat(defaultCountry)}
              style={{ width: '15rem' }}
              onChange={handleChange}
            >
              {countryDataArray?.map((elem, index) => (
                <Option key={index} value={getTextFormat(elem)}>
                  {getTextFormat(elem)}
                </Option>
              ))}
            </Select>
          ) : (
            <p>{getTextFormat(defaultCountry)}</p>
          )}
        </TextArea>
        <ButtonArea>
          {isCountryCodeEdit ? (
            <>
              <Button
                size="small"
                type="solid"
                className="color-Beige"
                disabled={selectedCountryCode === myProfile.nationalCode}
                onClick={handleSuccess}
              >
                {t('CM_SAVE')}
              </Button>
              <Button size="small" type="outlined" onClick={handleCancelChange}>
                {t('CM_CANCEL')}
              </Button>
            </>
          ) : (
            <Button
              size="small"
              type="outlined"
              onClick={() => setIsCountryCodeEdit(true)}
            >
              {t('CM_CHANGE')}
            </Button>
          )}
        </ButtonArea>
      </Data>
    </InnerItem>
  );
};

export default SettingDialogCountryCode;
