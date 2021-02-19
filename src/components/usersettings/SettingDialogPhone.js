import React from 'react';
import { Button } from 'antd';
import { Input, useCoreStores } from 'teespace-core';
import { getMobileNumber } from '../../utils/ProfileUtil';
import {
  InnerItem,
  Name,
  Data,
  TextArea,
  ButtonArea,
} from '../../styles/SettingDialogStyle';

const SettingDialogPhone = props => {
  const { phone, isPhoneEdit, onInputChange, onCancel, onSuccess } = props;
  const { authStore } = useCoreStores();

  return (
    <InnerItem>
      <Name>휴대폰 번호</Name>
      <Data>
        <TextArea>
          {isPhoneEdit ? (
            <Input
              type="number"
              value={phone}
              onChange={e => onInputChange(e.target.value)}
            />
          ) : (
            <p>{getMobileNumber(authStore.user)}</p>
          )}
        </TextArea>
        <ButtonArea>
          {isPhoneEdit ? (
            <>
              <Button
                size="small"
                type="solid"
                className="color-Beige"
                disabled={authStore.user.phone === phone}
                onClick={onSuccess}
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

export default SettingDialogPhone;
