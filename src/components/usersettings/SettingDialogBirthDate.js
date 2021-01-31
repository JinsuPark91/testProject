import React from 'react';
import { Button } from 'antd';
import { Input, useCoreStores } from 'teespace-core';
import {
  InnerItem,
  Name,
  Data,
  TextArea,
  ButtonArea,
} from '../../styles/SettingDialogStyle';

const SettingDialogBirthDate = props => {
  const {
    birthDate,
    isBirthDateEdit,
    onInputChange,
    onCancel,
    onSuccess,
  } = props;
  const { authStore } = useCoreStores();

  return (
    <InnerItem>
      <Name>생년월일</Name>
      <Data>
        <TextArea>
          {isBirthDateEdit ? (
            <Input
              type="number"
              maxLength={8}
              value={birthDate}
              placeholder="8자리 형태로 입력 (YYYYMMDD)"
              onChange={e => onInputChange(e.target.value)}
            />
          ) : (
            <p>{authStore.user.birthDate || '-'}</p>
          )}
        </TextArea>
        <ButtonArea>
          {isBirthDateEdit ? (
            <>
              <Button
                size="small"
                type="solid"
                className="color-Beige"
                disabled={authStore.user.birthDate === birthDate}
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

export default SettingDialogBirthDate;
