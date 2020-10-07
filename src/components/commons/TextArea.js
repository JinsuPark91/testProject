import React from 'react';
import styled from 'styled-components';
import { Input } from 'antd';

const { TextArea } = Input;

const StyledTextArea = styled(TextArea)`
  resize: none;
  border-radius: 12px;
  border: 1px solid #c6ced6;
`;

function CommonTextArea(props) {
  return <StyledTextArea {...props} />;
}

export default CommonTextArea;
