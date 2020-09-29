import React from 'react';
import styled from 'styled-components';
import { Button } from 'antd';
import './commons.scss';

const StyledButton = styled(Button)`
  border-radius: 15px;
  font-size: 12px;
  line-height: 18px;
  padding: 3px 23px 9px 23px;

  &.ant-btn-solid {
    background-color: #6c56e5;
    color: #fff;

    &:hover {
      background-color: #dcddff;
      color: #000000;
    }

    &:active {
      background-color: #523dc7;
      color: #fff;
    }

    &:disabled {
      background-color: #cccccc;
      color: #fff;
    }
  }

  &.ant-btn-outlined {
    border: 1px solid #c6ced6;
    background-color: #fff;
    color: #3b3b3b;

    &:hover {
      background-color: #dcddff;
      color: #000000;
    }
    &:active {
      border: 1px solid #6c56e5;
      color: #3b3b3b;
      background-color: #fff;
    }
    &:disabled {
      background-color: #cccccc;
      color: #fff;
    }
  }

  &.ant-btn-text {
    background-color: transparent;
    border: none;
    &:hover {
      background-color: #dcddff;
    }
    &:active {
      color: #523dc7;
    }
    &:disabled {
      color: #999999;
      background-color: transparent;
    }
  }

  &.ant-btn-system {
    background-color: #ffffff;
    border: 1px solid #c6ced6;
    border-radius: 4px;
    &:hover {
      background-color: #dcddff;
      color: #000000;
    }
    &:active {
      background-color: #bcbeff;
      color: #3b3b3b;
    }
    &:disabled {
      background-color: #cccccc;
      color: #ffffff;
    }
  }
`;

/**
 *
 * @param {Object} props
 * @param {('solid'|'outlined'|'text'|'system')} props.type
 * @param {('small'|'default')} props.size
 */
function CommonButton(props) {
  const { children, size, style } = props;

  const btnStyle = {
    height: size === 'small' ? 27 : 30,
    ...style,
  };

  return (
    <StyledButton {...props} style={btnStyle}>
      {children}
    </StyledButton>
  );
}

export default CommonButton;
