import styled, { css } from 'styled-components';
import { Modal } from 'antd';
import Upload from 'rc-upload';

export const Wrapper = styled(Modal)`
  .ant-modal-body {
    padding: 2.25rem 1.25rem 2rem;
  }
`;

export const SubTitle = styled.div`
  font-size: 0.81rem;
  color: ${props => props.theme.TextMain};
  margin: 1.25rem 0 0.44rem 0;
`;

export const NameInputBox = styled.div`
  display: flex;
  align-items: center;
  padding: 0 0 0 0.75rem;
  height: 1.88rem;
  background: ${props => props.theme.StateNormal};
  border-radius: 0.25rem;
  border: 0.06rem solid ${props => props.theme.LineOut};
  &:not(:disabled):focus-within {
    border: 1px solid ${props => props.theme.Iconmain};
  }

  &:hover {
    background-color: ${props => props.theme.StateBright};
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
  background: ${({ disabled, theme }) =>
    disabled ? `${theme.DisabledShape}` : `${theme.StateNormal}`};
  ${({ disabled, theme }) =>
    disabled
      ? css`
          color: ${theme.DisabledText};
          cursor: not-allowed;
        `
      : css`
          &:hover {
            background-color: ${theme.StateBright};
          }
        `}

  border-radius: 0.25rem;
  border: 0.06rem solid ${props => props.theme.LineOut};
  &:not(:disabled):focus-within {
    border: 1px solid ${props => props.theme.Iconmain};
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
      color: ${props => props.theme.IconHinted};
    }

    :disabled::placeholder {
      color: ${props => props.theme.DisabledText};
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

export const SpaceImage = styled.div`
  position: relative;
  margin: 0 auto 1.875rem;
  width: 4.88rem;
  height: 4.88rem;

  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 0.88rem;
    cursor: pointer;
  }

  img {
    width: 100%;
    height: 100%;
    border-radius: 0.88rem;
    object-fit: cover;
  }
`;

export const ImageChangeBox = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  border-radius: 0.88rem;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
`;

export const ImageChangButton = styled.div`
  position: absolute;
  top: calc(50% - 0.94rem);
  left: calc(50% - 0.94rem);
  width: 1.88rem;
  height: 1.88rem;
  color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  z-index: 1;
  &:hover {
    color: rgba(255, 255, 255, 0.7);
  }
  &.ant-dropdown-open {
    color: #ed7e49;
  }
`;

export const Blind = styled.span`
  position: absolute;
  clip: rect(0 0 0 0);
  width: 1px;
  height: 1px;
  margin: -1px;
  overflow: hidden;
`;

export const StyledUpload = styled(Upload)`
  &:focus {
    outline: 0;
  }
`;
