import React from 'react';
import { getRoomName } from '../MobileUtil';

const MobileSelectHeader = () => {
  return <div>{getRoomName()}</div>;
};

export default MobileSelectHeader;
