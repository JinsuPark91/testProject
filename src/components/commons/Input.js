import React, { useState, useEffect, useRef } from 'react';
import styled, { css } from 'styled-components';
import { Input, Tooltip } from 'antd';
import {
  CheckCircleOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';

const StyledInput = styled(Input)`
  width: 100%;
  border: 1px solid #c6ced6;
  border-radius: 25px;
  font-size: 12px;
  height: 30px;
  color: #3b3b3b;
  box-shadow: none !important;
  &::placeholder {
    color: #bdc6d3;
  }

  ${props =>
    props.numberofrighticons &&
    css`
      padding-right: ${props.numberofrighticons * 30}px;
    `}

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

  ${props =>
    props.checked &&
    css`
      border: 1px solid #16ac66 !important;
    `}
`;

const righticoncss = `
  position: absolute;
  margin-top: 2px;
  margin-left: -28px;
  font-size: 26px;
  cursor: pointer;
`;
const CheckedIcon = styled(CheckCircleOutlined)`
  ${righticoncss}
  color: #16ac66;
`;
const AlertIcon = styled(ExclamationCircleOutlined)`
  ${righticoncss}
  color: #ff5151;
`;

const PasswordVisibleIcon = styled(EyeOutlined)`
  position: absolute;
  font-size: 20px;
  ${props => css`
    margin-left: ${-props.numberofrighticons * 26}px;
  `}
  margin-top: 6px;
  cursor: pointer;
  color: #c6ced6;
`;

const PasswordInvisibleIcon = styled(EyeInvisibleOutlined)`
  position: absolute;
  font-size: 20px;
  ${props => css`
    margin-left: ${-props.numberofrighticons * 26}px;
  `}
  margin-top: 6px;
  cursor: pointer;
  color: #c6ced6;
`;

/**
 * Common Input
 * @param {Object} props
 * @param {string|boolean} props.alert
 * @param {('topLeft'|'topRight'|'leftTop'|'left'|'leftBottom'|'rightTop'|'right'|'rightBottom'|'bottomLeft'|'bottom'|'bottomRight')} props.placement
 * @param {function} props.getPopupContainer - alert tooltip의 DOM이 append될 container DOM을 반환. ex) () => document.body
 */
function CommonInput(props) {
  const {
    style,
    alert,
    placement,
    type,
    getPopupContainer = () => document.body,
    checked = false,
  } = props;

  const [visibleText, setVisibleText] = useState(true);
  const [inputType, setInputType] = useState(type);
  const [visibleAlert, setVisibleAlert] = useState(!!alert);
  const [prevAlert, setPrevAlert] = useState('');

  /* 입력창 입력 도중 alert 뜨고 right icon 누를 시 visible 변경이 blur와 겹쳐서 제대로 동작하지 않음 */
  const [onBlurring, setOnBlurring] = useState(false);

  const inputWrapperRef = useRef(null);
  console.log(props);

  // alert 메세지가 변경되면 다시 보여준다.
  if (alert !== prevAlert) {
    setPrevAlert(alert);
    setVisibleAlert(true);
  }

  const inputProps = {
    ...props,
  };

  delete inputProps.getPopupContainer;

  useEffect(() => {
    if (type === 'password') {
      setVisibleText(false);
    }
  }, [type]);

  // 타입이 비밀번호이면 텍스트로 전환할 수 있는 모드를 추가
  const handleVisibleText = () => {
    setInputType(visibleText ? 'password' : 'text');
    setVisibleText(!visibleText);
    inputWrapperRef.current.focus();
  };

  const handleVisibleAlert = () => {
    if (onBlurring) {
      setOnBlurring(false);
      return;
    }
    setVisibleAlert(!visibleAlert);
    inputWrapperRef.current.focus();
  };

  // alert message를 Input창에서 blur 했을 때 가린다.
  const handleOnBlur = () => {
    setOnBlurring(true);
    setVisibleAlert(false);
    setTimeout(() => {
      setOnBlurring(false);
    }, 100);
  };

  const numberOfRightIcons = (type === 'password') + !!alert + !!checked;
  return (
    <div style={style} ref={inputWrapperRef} onBlur={handleOnBlur}>
      <StyledInput
        {...inputProps}
        alert={alert}
        type={inputType}
        numberofrighticons={numberOfRightIcons}
        checked={checked}
      />
      {type === 'password' && (
        <>
          {visibleText && (
            <PasswordVisibleIcon
              onClick={handleVisibleText}
              numberofrighticons={numberOfRightIcons}
            />
          )}
          {!visibleText && (
            <PasswordInvisibleIcon
              onClick={handleVisibleText}
              numberofrighticons={numberOfRightIcons}
            />
          )}
        </>
      )}
      {checked && <CheckedIcon />}
      {!!alert && (
        <Tooltip
          color="#ff5151"
          title={alert}
          visible={visibleAlert}
          overlayStyle={{ fontSize: 12 }}
          placement={placement || 'bottomRight'}
          trigger="contextMenu"
          getPopupContainer={
            getPopupContainer || (() => inputWrapperRef.current)
          }
        >
          <AlertIcon
            onClick={handleVisibleAlert}
            onFocus={() => console.log('icon focus')}
          />
        </Tooltip>
      )}
    </div>
  );
}

export default CommonInput;
