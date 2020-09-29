import React from 'react';
import styled from 'styled-components';
import { Modal } from 'antd';
import CommonButton from './Button';
import './commons.scss';

export const ContentWrapper = styled.div`
  padding: 16px 16px 0 16px;
`;
/**
 * Common Dialog
 * @param {Object} props
 * @param {('small'|'medium'|'large')} props.size
 * @param {function} props.onOk
 * @param {function} props.onCancel
 * @param {Array} props.footer
 */
function CommonDialog(props) {
  const { size, children, onOk, onCancel, footer } = props;
  const getDialogWidth = sizeProp => {
    switch (sizeProp) {
      case 'medium':
        return 660;
      case 'large':
        return 950;
      case 'small':
      default:
        return 390;
    }
  };
  return (
    <Modal
      {...props}
      width={getDialogWidth(size)}
      style={{ top: 20 }}
      className="teespace-common"
      footer={
        footer !== null
          ? [
              <CommonButton key="submit" type="solid" onClick={onOk}>
                Submit
              </CommonButton>,
              <CommonButton key="back" type="outlined" onClick={onCancel}>
                Return
              </CommonButton>,
            ]
          : null
      }
    >
      {children}
    </Modal>
  );
}

export default CommonDialog;
