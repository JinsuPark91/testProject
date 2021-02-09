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

const SettingDialogCompanyNum = props => {
  const {
    companyNum,
    isCompanyNumEdit,
    onInputChange,
    onCancel,
    onSuccess,
  } = props;
  const { authStore } = useCoreStores();

  return (
    <InnerItem>
      <Name>회사 전화</Name>
      <Data>
        <TextArea>
          {isCompanyNumEdit ? (
            <Input
              type="number"
              value={companyNum}
              onChange={e => onInputChange(e.target.value)}
            />
          ) : (
            <p>
              {authStore.user.companyNum
                ? `${authStore.user.nationalCode || ''} ${
                    authStore.user.companyNum
                  }`
                : '-'}
            </p>
          )}
        </TextArea>
        <ButtonArea>
          {isCompanyNumEdit ? (
            <>
              <Button
                size="small"
                type="solid"
                className="color-Beige"
                disabled={authStore.user.companyNum === companyNum}
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

export default SettingDialogCompanyNum;
