import React from 'react';
import styled, { css } from 'styled-components';
import { CloseOutlined } from '@ant-design/icons';
import { Typography } from 'antd';

const { Text } = Typography;

const Wrapper = styled.div`
  opacity: 0.8;
  border: 1px solid #e0e5e9;
  border-radius: 8px;
  height: 42px;
  padding: 4px;
  display: flex;
  ${props =>
    props.closable
      ? css`
          width: 230px;
        `
      : css`
          width: 200px;
        `}
`;

const IconArea = styled.div`
  opacity: 0.15;
  margin: 2px;
  border-radius: 6px;
  width: 30px;
  height: 30px;
  margin-right: 6px;
`;

const TextWrapper = styled.div`
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
const AttachmentTitle = styled.div`
  font-size: 11px;
  color: #45474a;
  line-height: 15px;
  height: 15px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

const AttachmentSubTitle = styled.div`
  color: #888d96;
  font-size: 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const AttachmentClose = styled(CloseOutlined)`
  cursor: pointer;
  margin: 6px;
`;


/**
 * Common Attachment
 * @param {Object} props
 * @param {boolean} props.closable
 * @param {string} props.title
 * @param {string} props.subtitle
 */
function Attachment(props) {
  const { title, closable, subtitle } = props;
  return (
    <Wrapper closable={closable}>
      <IconArea style={{ backgroundColor: '#3C5ACA' }} />
      <TextWrapper>
        <AttachmentTitle>{title}</AttachmentTitle>
        <AttachmentSubTitle>{subtitle}</AttachmentSubTitle>
      </TextWrapper>
      {closable && <AttachmentClose />}
    </Wrapper>
  );
}

export default Attachment;
