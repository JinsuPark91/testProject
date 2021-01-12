import { Modal } from 'antd';
import styled, { css } from 'styled-components';

export const ConfigTitle = styled.div`
  display: flex;
  align-items: center;
  margin-top: 1rem;
`;

export const ConfigTitleText = styled.span`
  margin-left: 0.38rem;
  font-size: 0.81rem;
  line-height: 0.94rem;
  color: #000;
  font-weight: 500;
`;

export const ConfigDescriptionText = styled.div`
  margin: 0.19rem 0 0.94rem 1.32rem;
  white-space: pre-line;
  font-size: 0.75rem;
  line-height: 1rem;
  color: #777;
`;

export const Input = styled.div`
  display: flex;
  align-items: center;
  margin-left: 1.32rem;
  padding: 0 0.75rem;
  height: 1.8rem;
  background: ${({ disabled }) => (disabled ? '#cccccc' : '#fff')};
  ${({ disabled }) =>
    disabled &&
    css`
      color: #fff;
    `}
  border-radius: 25px;
  border: 1px solid #e3e7eb;

  &:focus-within {
    border: 1px solid #6c56e5;
  }

  & input {
    background: transparent;
    margin-right: 0.5rem;
    height: 1.13rem;
    border: 0;
    font-size: 0.75rem;
    width: 100%;

    ::placeholder {
      color: #bdc6d3;
    }

    :disabled::placeholder {
      color: #fff;
    }

    :focus {
      outline: 0;
    }
  }
`;

export const FlexModal = styled(Modal)`
  font-size: 16px;
  display: flex;
  justify-content: center;

  & .ant-modal-header {
    border-bottom: 1px solid #e3e7eb;
  }

  & .ant-modal-body {
    padding: 0;
  }
`;

export const ConfigWrapper = styled.div`
  padding: 0.19rem 1.88rem 1.19rem;
  border: solid #e3e7eb;
  border-width: 1px 0;
`;

export const ButtonContainer = styled.div`
  display: flex;
  padding: 1.06rem 0;
  align-items: center;
  justify-content: center;

  button:not(:last-child) {
    margin-right: 0.38rem;
  }
`;

export const StyledButton = styled.button`
  width: 4.5rem;
  height: 1.88rem;
  background: ${({ buttonType }) => (buttonType === 'ok' ? '#6c56e5' : '#fff')};
  color: ${({ buttonType }) => (buttonType === 'ok' ? '#fff' : '#3b3b3b')};
  border: 1px solid #c6ced6;
  border-radius: 0.94rem;
  cursor: pointer;
  outline: none;

  &:not(:disabled):hover {
    opacity: 0.8;
  }

  &:disabled {
    background: #ccc;
    color: #fff;
    border: 0;
  }
`;

export const LengthCounter = styled.div`
  color: ${({ disabled }) => (disabled ? '#fff' : '#bdc6d3')};
`;
