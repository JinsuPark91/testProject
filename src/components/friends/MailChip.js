import React from 'react';
import { Tag } from 'antd';

/**
 * 칩 형태의 컴포넌트
 * @param {Object} props
 * @param {string} props.text - 표시할 내용
 * @param {function} props.onClose - 칩을 close 했을 때 발생할 이벤트
 */
function MailChip({ text, onClose }) {
  return (
    <Tag closable onClose={onClose}>
      {text}
    </Tag>
  );
}

export default MailChip;
