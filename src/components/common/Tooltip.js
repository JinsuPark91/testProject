/* eslint-disable no-underscore-dangle */
import React, { useState, useRef, useEffect } from 'react';
import { Tooltip as AntdTooltip } from 'antd';

const Tooltip = props => {
  const { children, timeout = 3000 } = props;

  // 변수를 사용하게 되면 매번 timer가 초기화 되어 정상동작하지 않는다.
  // 동일한 참조값을 유지하기 위해 useRef를 쓴다.
  const timer = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  const resetTimer = () => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }

    timer.current = setTimeout(() => {
      setIsVisible(false);
      timer.current = null;
    }, timeout);
  };

  useEffect(() => {
    resetTimer();
  }, [isVisible]);

  const handleVisibleChange = flag => {
    setIsVisible(flag);
  };

  return (
    <AntdTooltip
      {...props}
      visible={isVisible}
      onVisibleChange={handleVisibleChange}
    >
      {children}
    </AntdTooltip>
  );
};

export default Tooltip;
