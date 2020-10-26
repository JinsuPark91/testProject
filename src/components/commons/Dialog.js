import React from 'react';
import styled from 'styled-components';
import { Modal } from 'antd';
import CommonButton from './Button';
import './commons.scss';

const StyledContentWrapper = styled.div`
  padding: 1rem  1rem  0 1rem ;
`;

export const ContentWrapper = StyledContentWrapper;
ContentWrapper.displayName = 'ContentWrapper';
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

  let footerElem = [
    <CommonButton key="submit" type="solid" onClick={onOk}>
      예
    </CommonButton>,
    <CommonButton key="back" type="outlined" onClick={onCancel}>
      아니오
    </CommonButton>,
  ];
  if (footer === null) {
    footerElem = null;
  }
  if (footer !== undefined) {
    footerElem = footer;
  }
  return (
    <Modal
      {...props}
      width={getDialogWidth(size)}
      style={{ top: 20 }}
      className="teespace-common"
      footer={footerElem}
    >
      {children}
    </Modal>
  );
}

export default CommonDialog;
