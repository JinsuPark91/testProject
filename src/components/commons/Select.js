import React from 'react';
import { Select } from 'antd';
import './commons.scss';

function CommonSelect(props) {
  const { children } = props;
  const antdProps = { ...props };
  delete antdProps.fullWidth;

  return (
    <Select
      className="teespace-common"
      dropdownClassName="teespace-common"
      dropdownMatchSelectWidth={false}
      {...antdProps}
    >
      {children}
    </Select>
  );
}

export default CommonSelect;
export const CommonOption = Select.Option;
