import React from 'react';
import { Modal } from 'antd';
import './Dialog.scss';

/**
 * Common Dialog
 * @param {Object} props
 * @param {('small'|'medium'|'large')} props.size
 */
function CommonDialog(props) {
  const { size } = props;
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
      className="teespace-common-modal"
    >
      <div>asdasda</div>
    </Modal>
  );
}

export default CommonDialog;
