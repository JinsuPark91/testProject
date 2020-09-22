import React from 'react';
import { Modal } from 'antd';
import CommonButton from './Button';
import './commons.scss';

/**
 * Common Dialog
 * @param {Object} props
 * @param {('small'|'medium'|'large')} props.size
 */
function CommonDialog(props) {
  const { size, children, onOk, onCancel } = props;
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
      footer={[
        <CommonButton key="submit" type="solid" onClick={onOk}>
          Submit
        </CommonButton>,
        <CommonButton key="back" type="outlined" onClick={onCancel}>
          Return
        </CommonButton>,
      ]}
    >
      {children}
    </Modal>
  );
}

export default CommonDialog;
