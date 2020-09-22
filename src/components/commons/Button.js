import React from 'react';
import { Button } from 'antd';
import './commons.scss';

/**
 * 
 * @param {Object} props
 * @param {('solid'|'outlined')} props.type
 */
function CommonButton(props) {
  const { children } = props;
  return (
    <Button {...props} className="teespace-common">
      {children}
    </Button>
  );
}

export default CommonButton;
