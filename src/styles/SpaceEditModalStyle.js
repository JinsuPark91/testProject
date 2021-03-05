import styled, { css } from 'styled-components';
import { Modal } from 'antd';

export const Wrapper = styled(Modal)`
  .ant-modal-body {
    padding: 0 1.25rem 2rem;
  }
`;

export const SubTitle = styled.div`
  font-size: 0.81rem;
  color: #000000;
  margin: 1.25rem 0 0.44rem 0;
`;

export const NameInputBox = styled.div`
  display: flex;
  align-items: center;
  padding: 0 0 0 0.75rem;
  height: 1.88rem;
  background: #fff;
  border-radius: 0.25rem;
  border: 0.06rem solid #d0ccc7;
  &:not(:disabled):focus-within {
    border: 1px solid #7b7671;
  }

  &:hover {
    background-color: #faf8f7;
    border: 0.06rem solid #d0ccc7;
  }

  & input {
    background: transparent;
    margin-right: 0.5rem;
    height: 1.13rem;
    border: 0;
    width: 100%;
  }
`;

export const UrlInputBox = styled.div`
  display: flex;
  align-items: center;
  padding: 0 0.75rem;
  height: 1.88rem;
  background: ${({ disabled }) => (disabled ? '#cccccc' : '#fff')};
  ${({ disabled }) =>
    disabled
      ? css`
          color: #fff;
          cursor: not-allowed;
        `
      : css`
          &:hover {
            background-color: #faf8f7;
            border: 0.06rem solid #d0ccc7;
          }
        `}

  border-radius: 0.25rem;
  border: 0.06rem solid #d0ccc7;
  &:not(:disabled):focus-within {
    border: 1px solid #7b7671;
  }

  & input {
    background: transparent;
    margin-right: 0.5rem;
    height: 1.13rem;
    border: 0;

    ${({ disabled }) =>
      disabled &&
      css`
        cursor: not-allowed;
      `}

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

export const ErrorIcon = styled.div`
  display: ${props => (props.visible ? 'flex' : 'none')};
  margin-right: 0.2rem;
`;

export const UrlText = styled.span`
  font-size: 0.88rem;
`;
