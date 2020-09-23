import React from 'react';
import { Button } from 'antd';
import './commons.scss';

/**
 * 
 * @param {Object} props
 * @param {('solid'|'outlined'|'text'|'system')} props.type
 * @param {('small'|'default')} props.size
 */
function CommonButton(props) {
  const { children, size } = props;

  return (
    <Button
      {...props}
      className="teespace-common"
      style={{ height: size === 'small' ? 27 : 30 }}
    >
      {children}
    </Button>
  );
}

export default CommonButton;
