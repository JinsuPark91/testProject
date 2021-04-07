import styled from 'styled-components';
import { Button, Input, Modal } from 'antd';

export const StyledModal = styled(Modal)`
  .ant-modal-body {
    padding: 0;
  }
  .ant-modal-header {
    padding: 0.69rem 0 0.75rem;
  }
  .ant-modal-title {
    font-size: 0.88rem;
    line-height: 1.25rem;
    color: #000000;
    letter-spacing: 0;
  }
`;

export const StyledContent = styled.div`
  padding: 1.13rem 1rem 1.44rem;
`;

export const StyledInputBox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.88rem;
`;

export const StyledChipBox = styled.div`
  overflow-y: auto;
  height: 5.2rem;
  margin-top: 0.56rem;
  padding: 0 0 0.38rem 0.38rem;
  background-color: white;
  border: 0.06rem solid #d0ccc7;
  border-radius: 0.25rem;
  & > div {
    margin: 0.25rem 0.38rem 0 0;
    vertical-align: top;
  }
`;

export const StyledInfoTitle = styled.h3`
  font-size: 0.81rem;
  line-height: 1.19rem;
  color: #000000;
  letter-spacing: 0;
  margin-bottom: 0.38rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const StyledInfoText = styled.p`
  font-size: 0.75rem;
  line-height: 0.91rem;
  color: #777;
  letter-spacing: 0;
  white-space: pre-line;
`;

export const StyledInput = styled(Input)`
  margin-right: 0.5rem;
`;

export const StyledLinkButton = styled(Button)`
  &.ant-btn {
    height: auto;
    margin-top: 1rem;
    padding: 0;
    font-size: 0.81rem;
    line-height: 1.19rem;
    color: #00493d;
    &:hover span {
      text-decoration: underline;
    }
  }
`;

export const SendButton = styled.button`
  height: 1.88rem;
  width: 1.88rem;
  line-height: 0;
  background-color: #f7f4ef;
  border-radius: 0.38rem;
  border: none;
  &:hover {
    background-color: #ebe6df;
  }
  &:active {
    background-color: #ddd7cd;
  }
  img {
    width: 1.08rem;
  }
`;
