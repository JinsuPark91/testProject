import React from 'react';
import { Button, Select } from 'antd';
import {
  InnerItem,
  Name,
  Data,
  TextArea,
  ButtonArea,
} from '../../styles/SettingDialogStyle';

const SettingDialogCountryCode = props => {
  const { isCountryCodeEdit, onCancel, onSuccess } = props;
  const { Option } = Select;

  return (
    <InnerItem>
      <Name>국가 번호</Name>
      <Data>
        <TextArea>
          {isCountryCodeEdit ? (
            <Select defafaultValue="test">
              <Option value="test">test</Option>
              <Option value="test1">test1</Option>
              <Option value="test2">test2</Option>
            </Select>
          ) : (
            <p>Country Code</p>
          )}
        </TextArea>
        <ButtonArea>
          {isCountryCodeEdit ? (
            <>
              <Button size="small" type="outlined" onClick={onSuccess}>
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
