import { Modal, Checkbox } from 'antd';
import styled, { css } from 'styled-components';

export const Wrapper = styled.div`
  padding: 2.06rem 2.13rem 0 1.56rem;
`;

export const ButtonContainer = styled.div`
  display: flex;
  height: 4rem;
  align-items: center;
  justify-content: center;
  & button:not(:last-child) {
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

export const Input = styled.div`
  margin-top: 0.63rem;
  width: 31.25rem;
  display: flex;
  align-items: center;
  padding: 0 0.75rem;
  height: 1.8rem;
  font-size: 0.75rem;
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

export const Title = styled.div`
  font-size: 0.94rem;
  font-weight: 600;
`;
export const Description = styled.div`
  font-size: 0.75rem;
  color: #8e8d94;
  margin-top: 0.44rem;
`;

export const LengthCounter = styled.div`
  color: #bdc6d3;
`;

export const ConfigWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 0.88rem 1.19rem 0 1.19rem;
`;
