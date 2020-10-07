import React from 'react';
import styled from 'styled-components';
import { Switch } from 'antd';

const StyledSwitch = styled(Switch)`
  height: 21px;
  background-color: #c6ced6;

  &:not(.ant-switch-disabled) {
    &.ant-switch-checked {
      background-color: #6c56e5;
      &:focus {
        border: 1px solid #ddd7ff;
      }
    }
    &:focus:not(.ant-switch-checked) {
      background: #c6ced6;
      border: 1px solid #6c56e5;
    }
  }
  &.ant-switch-disabled {
    background-color: #cccccc;
  }

  .ant-switch-handle {
    border-radius: 50%;
    top: 3px;
    bottom: 3px;
    width: 15px;
    height: 15px;
  }
`;

function CommonSwitch(props) {
  return <StyledSwitch {...props} />;
}

export default CommonSwitch;
