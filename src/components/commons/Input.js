import React from 'react';
import styled, { css } from 'styled-components';
import { Input, Tooltip } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const StyledInput = styled(Input)`
  width: inherit;
  border: 1px solid #c6ced6;
  border-radius: 25px;
  font-size: 12px;
  height: 30px;
  color: #3b3b3b;
  &::placeholder {
    color: #bdc6d3;
  }
  &:hover {
    background-color: #dcddff;
    border: 1px solid #c6ced6;
    color: #000000;
  }
  &:active,
  &:focus {
    border: 1px solid #6c56e5;
    color: #000000;
    box-shadow: none;
  }
  &:disabled {
    background-color: #cccccc;
    border-color: #c6ced6;
    color: #ffffff;
  }
  ${props =>
    props.alert &&
    css`
      border: 1px solid #ff5151;
    `}
`;

const AlertIcon = styled(ExclamationCircleOutlined)`
  position: absolute;
  margin-top: 2px;
  margin-left: -28px;
  font-size: 26px;
  color: #ff5151;
`;

/**
 * Common Input
 * @param {Object} props
 * @param {string|boolean} props.alert
 * @param {('topLeft'|'topRight'|'leftTop'|'left'|'leftBottom'|'rightTop'|'right'|'rightBottom'|'bottomLeft'|'bottom'|'bottomRight')} props.placement
 */
function CommonInput(props) {
  const { style, alert, placement } = props;
  const inputProps = {
    ...props,
    style: {},
  };

  return (
    <div style={style}>
      <StyledInput {...inputProps} alert={alert} />
      {!!alert && (
        <Tooltip
          color="#ff5151"
          title={alert}
          visible
          overlayStyle={{ fontSize: 12 }}
          placement={placement || 'bottom'}
        >
          <AlertIcon />
        </Tooltip>
      )}
    </div>
  );
}

export default CommonInput;
