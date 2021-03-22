import React, { useState } from 'react';
import { Button, Select } from 'antd';
import { useCoreStores } from 'teespace-core';
import { useTranslation } from 'react-i18next';
import countryData from 'country-data';
import {
  InnerItem,
  Name,
  Data,
  TextArea,
  ButtonArea,
} from '../../styles/SettingDialogStyle';

const SettingDialogCountryCode = props => {
  const { t } = useTranslation();
  const { isCountryCodeEdit, onCancel, onSuccess } = props;
  const { userStore, authStore } = useCoreStores();
  const [selectedCountryCode, setSelectedCountryCode] = useState(
    authStore.user.nationalCode,
  );
  const { Option } = Select;

  const countryDataArray = countryData.countries?.all;
  const defaultCountry = authStore.user.nationalCode
    ? countryDataArray.find(
        elem => elem.countryCallingCodes[0] === authStore.user.nationalCode,
      )
    : null;

  const getTextFormat = item => {
    return item ? `${item.countryCallingCodes[0] || ''} ${item.name}` : '-';
  };

  const handleChange = value => {
    setSelectedCountryCode(value.split(' ')[0]);
  };

  const handleSuccess = async () => {
    const obj = {};
    obj.profilePhoto = userStore.getProfilePhotoURL(
      userStore.myProfile.id,
      'medium',
    );
    obj.profileFile = null;
    obj.profileName = null;
    obj.backPhoto = userStore.getBackgroundPhotoURL(userStore.myProfile.id);
    obj.backFile = null;
    obj.backName = null;
    obj.name = userStore.myProfile.name;
    obj.nick = userStore.myProfile.nick;
    obj.nationalCode = selectedCountryCode;
    obj.companyNum = userStore.myProfile.companyNum;
    obj.phone = userStore.myProfile.phone;
    obj.birthDate = userStore.myProfile.birthDate;
    try {
      await userStore.updateMyProfile(obj);
    } catch (e) {
      console.log(`change National Code Error is ${e}`);
    }
    onSuccess();
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
              {countryDataArray?.map(elem => (
                <Option key={elem.name} value={getTextFormat(elem)}>
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
                disabled={selectedCountryCode === authStore.user.nationalCode}
                onClick={handleSuccess}
              >
                {t('CM_SAVE')}
              </Button>
              <Button size="small" type="outlined" onClick={onCancel}>
                {t('CM_CANCEL')}
              </Button>
            </>
          ) : (
            <Button size="small" type="outlined" onClick={onCancel}>
              {t('CM_CHANGE')}
            </Button>
          )}
        </ButtonArea>
      </Data>
    </InnerItem>
  );
};

export default SettingDialogCountryCode;
