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
  Info,
} from '../../styles/SettingDialogStyle';

const SettingDialogNick = props => {
  const { nick, isNickEdit, onInputChange, onCancel, onSuccess } = props;
  const { authStore } = useCoreStores();

  return (
    <InnerItem>
      <Name>별명</Name>
      <Data>
        <TextArea>
          {isNickEdit ? (
            <EditNameInput
              maxLength={20}
              placeholder={authStore.user.name}
              value={nick}
              onChange={input => {
                onInputChange(input);
              }}
            />
          ) : (
            <p>{authStore.user.nick || '-'}</p>
          )}
          <Info>스페이스에서 불리고 싶은 별명을 설정할 수 있습니다.</Info>
        </TextArea>
        <ButtonArea>
          {isNickEdit ? (
            <>
              <Button
                size="small"
                type="solid"
                className="color-Beige"
                disabled={authStore.user.nick === nick}
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

export default SettingDialogNick;
