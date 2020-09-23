import React from 'react'
import styled, { css } from 'styled-components';
import { Row } from 'antd';
import {
  CheckOutlined,
  InfoCircleOutlined,
  CloseOutlined,
} from '@ant-design/icons';

const ChipWrapper = styled.div`
  background-color: #ffffff;
  border: 1px solid #c6ced6;
  border-radius: 25px;
  display: inline-block;

  &:hover {
    background-color: #dcddff;
    border: 1px solid #6c56e5;
  }

  &:active {
    background-color: #6c56e5;
    color: #ffffff;
  }

  ${props =>
    props.disabled &&
    css`
      background-color: #cccccc;
      color: #ffffff;
    `}

  ${props =>
    props.alert &&
    css`
      background-color: #ffdada !important;
      color: #000000 !important;
      border-color: #ff5353 !important;
    `}

  ${props =>
    props.checked &&
    css`
      background-color: #e0e1eb !important;
      color: #3b3b3b !important;
      border-color: #c6ced6 !important;
    `}


  ${props =>
    props.size === 'small'
      ? css`
          height: 26px;
        `
      : css`
          height: 30px;
        `}
`;

const ChipContent = styled.div`
  height: 100%;
  align-items: center;
  display: flex;
`;
const ChipTextContent = styled(Row)`
  height: 100%;
  margin: 0 12px;
  font-size: 12px;
`;

const ChipInfoIcon = styled(InfoCircleOutlined)`
  font-size: 26px;
  & > svg {
    vertical-align: middle;
  }
  ${props =>
    props.alert &&
    css`
      color: #fb3a3a;
    `}
`;

const ChipCloseButton = styled(CloseOutlined)`
  cursor: pointer;
  margin-right: 5px;

  ${props =>
    props.alert &&
    css`
      color: #75757f;
    `}
`;

const ChipCheckedIcon = styled(CheckOutlined)`
  margin-right: 5px;
  ${props =>
    props.alert &&
    css`
      color: #75757f;
    `}
`;

/**
 * Common Chip
 * @param {Object} props
 * @param {string || ReactNode} props.icon
 * @param {string} props.text
 * @param {('small'|'default')} props.size
 * @param {boolean} props.alert
 * @param {boolean} props.checked
 * @param {disabled} props.disabled
 * @param {function} props.onClose
 */
function CommonChip(props) {
  const { size, icon, alert, onClose, text, checked, disabled } = props;
  return (
    <ChipWrapper
      size={size || 'default'}
      disabled={disabled}
      alert={alert}
      checked={checked}
    >
      <ChipContent>
        {typeof icon === 'string' && icon}
        {typeof icon !== 'string' && icon}
        {alert && <ChipInfoIcon alert={alert} />}
        <ChipTextContent align="middle">{text}</ChipTextContent>
        {checked && <ChipCheckedIcon alert={alert} />}
        {!checked && <ChipCloseButton onClick={onClose} alert={alert} />}
      </ChipContent>
    </ChipWrapper>
  );
}

export default CommonChip;
