import React, { useState, useEffect, useRef } from 'react';
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

  ${props =>
    props.hasrighticon &&
    css`
      padding-right: 30px;
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
 * @param {function} props.getPopupContainer - alert tooltip의 DOM이 append될 container DOM을 반환. ex) () => document.body
 */
function CommonInput(props) {
  const {
    style,
    alert,
    placement,
    type,
    getPopupContainer = () => document.body,
  } = props;

  const [visibleText, setVisibleText] = useState(true);
  const [inputType, setInputType] = useState(type);
  const [visibleAlert, setVisibleAlert] = useState(!!alert);
  const [prevAlert, setPrevAlert] = useState('');

  /* 입력창 입력 도중 alert 뜨고 right icon 누를 시 visible 변경이 blur와 겹쳐서 제대로 동작하지 않음 */
  const [onBlurring, setOnBlurring] = useState(false);

  const inputWrapperRef = useRef(null);

  // alert 메세지가 변경되면 다시 보여준다.
  if (alert !== prevAlert) {
    setPrevAlert(alert);
    setVisibleAlert(true);
  }

  const inputProps = {
    ...props,
  };

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

  const hasRightIcon = type === 'password' || !!alert;

  return (
    <div style={style} ref={inputWrapperRef} onBlur={handleOnBlur}>
      <StyledInput
        {...inputProps}
        alert={alert}
        type={inputType}
        hasrighticon={hasRightIcon}
      />
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
