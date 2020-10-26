import React from 'react';
import styled from 'styled-components';
import { Button } from 'antd';
import './commons.scss';

const StyledButton = styled(Button)`
  outline: 0;
  border-radius: 20px;
  height: auto;
  font-size: 0.75rem;
  line-height: 1.25rem;
  padding: 0.6875rem 0;
  text-align: center;
  border: 1px solid transparent;

  &.ant-btn-solid {
    background-color: #6c56e5;
    border-color: #6c56e5;
    color: #fff;

    &:hover {
      background-color: #dcddff;
      border-color: #dcddff;
      color: #fff;
    }

    &:active,
    &:focus {
      background-color: #523dc7;
      border-color: #523dc7;
      color: #fff;
    }

    &:disabled {
      background-color: #cccccc;
      border-color: #cccccc;
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
  const { children } = props;

  return (
    <StyledButton {...props} >
      {children}
    </StyledButton>
  );
}

export default CommonButton;
