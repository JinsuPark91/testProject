import { Checkbox } from 'antd';
import styled, { css } from 'styled-components';

export const ConfigTitle = styled.div`
  display: flex;
  align-items: center;
  margin: 0.94rem 0 0.25rem 0.38rem;
`;

export const ConfigTitleText = styled.span`
  font-size: 0.81rem;
  color: #000000;
  font-weight: bold;
  margin-left: 0.38rem;
`;

export const ConfigDescriptionText = styled.div`
  white-space: pre-line;
  padding-left: 1.3rem;
  font-size: 0.75rem;
  color: #777777;
  margin-bottom: 0.88rem;
`;

export const Input = styled.div`
  display: flex;
  align-items: center;
  margin-left: 1.3rem;
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

export const ConfigWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 1.19rem 1.31rem; 1.19rem;
  border-bottom: 1px solid #e3e7eb;
`;

export const ButtonContainer = styled.div`
  display: flex;
  border-top: 1px solid #e3e7eb;
  height: 4.3rem;
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

export const LengthCounter = styled.div`
  color: ${({ disabled }) => (disabled ? '#fff' : '#bdc6d3')};
`;
