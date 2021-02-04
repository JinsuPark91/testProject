import React, { useState } from 'react';
import { Button, Select } from 'antd';
import { useCoreStores } from 'teespace-core';
import countryData from 'country-data';
import {
  InnerItem,
  Name,
  Data,
  TextArea,
  ButtonArea,
} from '../../styles/SettingDialogStyle';

const SettingDialogCountryCode = props => {
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
    obj.backPhoto = userStore.getBackgroundPhotoURL(userStore.myProfile.id);
    obj.name = userStore.myProfile.name;
    obj.nick = userStore.myProfile.nick;
    obj.nationalCode = selectedCountryCode;
    obj.companyNum = userStore.myProfile.companyNum;
    obj.phone = userStore.myProfile.phone;
    obj.birthDate = userStore.myProfile.birthDate;
    try {
      await userStore.updateMyProfile(obj);
    } catch (e) {
      console.log(`changeNationalCode Error is ${e}`);
    }
    onSuccess();
  };

  return (
    <InnerItem>
      <Name>국가 번호</Name>
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
                저장
              </Button>
              <Button size="small" type="outlined" onClick={onCancel}>
                취소
              </Button>
            </>
          ) : (
            <Button size="small" type="outlined" onClick={onCancel}>
              변경
            </Button>
          )}
        </ButtonArea>
      </Data>
    </InnerItem>
  );
};

export default SettingDialogCountryCode;
