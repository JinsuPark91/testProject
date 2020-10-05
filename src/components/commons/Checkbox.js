import React from 'react';
import styled, { css } from 'styled-components';
import { Checkbox } from 'antd';

const StyledCheckbox = styled(Checkbox)`
  .ant-checkbox-inner {
    ${props =>
      props.shape === 'round'
        ? css`
            border-radius: 50%;
          `
        : css`
            border-radius: 4px;
          `}
    outline: 0;
    box-shadow: 0 !important;
    outline: 0 !important;
    border: 1px solid #c6ced6 !important;
    box-shadow: 0 !important;
  }

  .ant-checkbox-checked::after {
    border: 0 !important;
  }

  .ant-checkbox-input:focus + .ant-checkbox-inner {
    border: 1px solid #ddd7ff !important;
  }

  .ant-checkbox-checked:not(.ant-checkbox-disabled) .ant-checkbox-inner {
    background-color: #6c56e5;
  }
`;

/**
 *
 * @param {Object} props
 * @param {('default'|'round')} props.shape
 * @param {function} props.onChange
 */
function CommonCheckbox(props) {
  const { shape = 'default' } = props;
  return <StyledCheckbox {...props} shape={shape} />;
}

export default CommonCheckbox;
