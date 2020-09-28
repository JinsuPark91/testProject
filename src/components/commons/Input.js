import React, { useState, useEffect } from 'react';
import styled, { css } from 'styled-components';
import { Input, Tooltip } from 'antd';
import {
  EyeOutlined,
  EyeInvisibleOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';

const StyledInput = styled(Input)`
  width: inherit;
  border: 1px solid #c6ced6;
  border-radius: 25px;
  font-size: 12px;
  height: 30px;
  color: #3b3b3b;
  box-shadow: none !important;
  &::placeholder {
    color: #bdc6d3;
  }
  &:hover:not(:disabled) {
    ${props =>
      !props.alert &&
      css`
        background-color: #dcddff;
        border: 1px solid #c6ced6;
        color: #000000;
      `}
  }
  &:active,
  &:focus {
    &:not(:disabled) {
      ${props =>
        !props.alert &&
        css`
          border: 1px solid #6c56e5;
          color: #000000;
        `}
    }
  }
  &:disabled {
    background-color: #cccccc;
    border-color: #c6ced6;
    color: #ffffff;
  }
  ${props =>
    props.alert &&
    css`
      border: 1px solid #ff5151 !important;
    `}
`;

const AlertIcon = styled(ExclamationCircleOutlined)`
  position: absolute;
  margin-top: 2px;
  margin-left: -28px;
  font-size: 26px;
  color: #ff5151;
  cursor: pointer;
`;

const PasswordVisibleIcon = styled(EyeOutlined)`
  position: absolute;
  font-size: 20px;
  margin-left: -26px;
  margin-top: 6px;
  cursor: pointer;
  color: #c6ced6;
`;

const PasswordInvisibleIcon = styled(EyeInvisibleOutlined)`
  position: absolute;
  font-size: 20px;
  margin-left: -26px;
  margin-top: 6px;
  cursor: pointer;
  color: #c6ced6;
`;

/**
 * Common Input
 * @param {Object} props
 * @param {string|boolean} props.alert
 * @param {('topLeft'|'topRight'|'leftTop'|'left'|'leftBottom'|'rightTop'|'right'|'rightBottom'|'bottomLeft'|'bottom'|'bottomRight')} props.placement
 */
function CommonInput(props) {
  const { style, alert, placement, type } = props;

  const [visibleText, setVisibleText] = useState(true);
  const [inputType, setInputType] = useState(type);
  const [visibleAlert, setVisibleAlert] = useState(!!alert);
  const inputProps = {
    ...props,
    style: {},
  };

  useEffect(() => {
    if (type === 'password') {
      setVisibleText(false);
    }
  }, [type]);

  const handleVisibleText = () => {
    setInputType(visibleText ? 'password' : 'text');
    setVisibleText(!visibleText);
  };

  const handleVisibleAlert = () => {
    setVisibleAlert(!visibleAlert);
  };

  return (
    <div style={style}>
      <StyledInput {...inputProps} alert={alert} type={inputType} />
      {type === 'password' && (
        <>
          {visibleText && <PasswordVisibleIcon onClick={handleVisibleText} />}
          {!visibleText && (
            <PasswordInvisibleIcon onClick={handleVisibleText} />
          )}
        </>
      )}
      {!!alert && (
        <Tooltip
          color="#ff5151"
          title={alert}
          visible={visibleAlert}
          overlayStyle={{ fontSize: 12 }}
          placement={placement || 'bottom'}
        >
          <AlertIcon onClick={handleVisibleAlert} />
        </Tooltip>
      )}
    </div>
  );
}

export default CommonInput;
