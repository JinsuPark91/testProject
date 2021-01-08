import React from 'react';
import { Button } from 'antd';
import { useCoreStores } from 'teespace-core';
import {
  InnerItem,
  Name,
  Data,
  TextArea,
  EditNameInput,
  ButtonArea,
} from '../../styles/SettingDialogStyle';

const SettingDialogName = props => {
  const { name, isNameEdit, onInputChange, onCancel, onSuccess } = props;
  const { authStore } = useCoreStores();

  return (
    <InnerItem>
      <Name>이름</Name>
      <Data>
        <TextArea>
          {isNameEdit ? (
            <EditNameInput
              maxLength={20}
              placeholder={authStore.user.name}
              value={name}
              onChange={input => {
                onInputChange(input);
              }}
            />
          ) : (
            <p>{authStore.user.name || '-'}</p>
          )}
        </TextArea>
        <ButtonArea>
          {isNameEdit ? (
            <>
              <Button
                size="small"
                type="outlined"
                disabled={authStore.user.name === name}
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

export default SettingDialogName;
