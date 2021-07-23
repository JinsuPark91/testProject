import styled from 'styled-components';
import { Modal } from 'teespace-core';
import { Menu } from 'antd';
import Upload from 'rc-upload';
import CameraIcon from '../../assets/camera.svg';
import InputCounter from '../../components/Input';

export const DialogWrap = styled(Modal)`
  .ant-modal-footer {
    height: 3.8rem;
    padding: 0.64rem 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

export const LayoutWrap = styled.div`
  display: flex;
`;

export const SiderArea = styled.div`
  width: 10.94rem;
  background-color: ${props => props.theme.SubStateNormal};
`;

export const ContentArea = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 67vh;
`;

export const StyledMenu = styled(Menu)`
  background-color: ${props => props.theme.SubStateNormal};
  border: 0;
  .ant-menu-item-group-title {
    padding: 1.25rem 1.25rem 0.625rem;
    font-size: 0.75rem;
    line-height: 1.125rem;
    color: #717171;
  }
  .ant-menu-item {
    height: 2.38rem;
    margin: 0 0.25rem !important;
    padding: 0 2.5rem;
    border-radius: 0.25rem;
    font-size: 0.81rem;
    line-height: 2.38rem;
    color: ${props => props.theme.TextMain};
    &.ant-menu-item-selected {
      background-color: ${props => props.theme.SubStateDark};
    }
    &:hover {
      color: ${props => props.theme.TextMain};
    }
    &:active {
      background-color: ${props => props.theme.SubStateDark};
    }
  }
`;

export const InnerList = styled.ul`
  overflow-y: auto;
  height: 100%;
  padding: 1.56rem 1.25rem 1.25rem;
  font-size: 0.81rem;
  color: ${props => props.theme.TextMain};
`;

export const InnerItem = styled.li`
  overflow: hidden;
  &:first-of-type {
    margin-bottom: 1.25rem;
  }
  & + & {
    margin-top: 0.44rem;
  }
`;

export const Name = styled.p`
  float: left;
  min-width: 13.13rem;
  padding-right: 1.25rem;
  line-height: 1.875rem;
`;

export const Data = styled.div`
  overflow: hidden;
  display: flex;
  padding-right: 6rem;
  font-weight: 500;
  .ant-btn {
    padding: 0 0.81rem;
    & + .ant-btn {
      margin-left: 0.38rem;
    }
  }
`;

export const ImageBox = styled.div`
  overflow: hidden;
  position: relative;
  width: 3.38rem;
  height: 3.38rem;
  margin-bottom: 0.625rem;
  flex-shrink: 0;
  border-radius: 50%;
  cursor: pointer;
  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.2);
    cursor: default;
  }
  & > img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const ImageIcon = styled.span`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 1.5rem;
  height: 1.5rem;
  transform: translate(-50%, -50%);
  background-image: url('${CameraIcon}');
  background-size: contain;
  z-index: 5;
`;

export const Info = styled.span`
  display: block;
  font-size: 0.75rem;
  line-height: 1.125rem;
  font-weight: 400;
  color: #8d8d8d;
  span {
    color: #6c56e5;
    text-decoration: underline;
  }
`;

export const TextArea = styled.div`
  margin-right: 1.25rem;
  p {
    line-height: 1.875rem;
    word-break: break-word;
    word-wrap: break-word;
  }
  .ant-input {
    width: 13.75rem;
    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
  }
`;

export const ButtonArea = styled.div`
  margin: 0.125rem 0 0 auto;
  flex-shrink: 0;
`;

export const EditNameInput = styled(InputCounter)`
  width: 13.75rem;
  height: 1.875rem;
  .input-counter {
    font-size: 0.69rem;
  }
`;

export const StyledUpload = styled(Upload)`
  &:focus {
    outline: 0;
  }
`;

export const LockIconBox = styled.span`
  display: inline-block;
  min-width: 3.5rem;
  text-align: center;
  color: #75757f;
`;
