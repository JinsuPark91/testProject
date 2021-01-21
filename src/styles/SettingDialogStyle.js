import styled from 'styled-components';
import Upload from 'rc-upload';
import CameraIcon from '../assets/ts_camera.svg';
import InputCounter from '../components/Input';

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
  line-height: 1.69rem;
`;

export const Data = styled.div`
  overflow: hidden;
  display: flex;
  min-height: 1.69rem;
  align-items: center;
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
  margin-right: 0.63rem;
  flex-shrink: 0;
  border: 2px solid #6c56e5;
  border-radius: 50%;
  cursor: pointer;
  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.1);
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
  margin-top: 0.63rem;
  font-size: 0.75rem;
  line-height: 0.94rem;
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
    word-break: break-word;
    word-wrap: break-word;
  }
  .ant-input {
    width: 11.88rem;
    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
  }
`;

export const ButtonArea = styled.div`
  margin-left: auto;
  margin-right: 3rem;
  flex-shrink: 0;
`;

export const EditNameInput = styled(InputCounter)`
  width: 11.88rem;
  .input-counter {
    font-size: 0.69rem;
    color: #bdc6d3;
  }
`;

export const StyledUpload = styled(Upload)`
  &:focus {
    outline: 0;
  }
`;

export const LockIconBox = styled.span`
  color: #75757f;
`;
