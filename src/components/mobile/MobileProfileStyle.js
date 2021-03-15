import styled, { css } from 'styled-components';
import Upload from 'rc-upload';
import { Input, Button } from 'antd';
import InputCounter from '../Input';
import friendsIcon from '../../assets/profile_talk.svg';
import profileEditIcon from '../../assets/profile_edit.svg';
import meetingIcon from '../../assets/meeting.svg';
import OfficeIcon from '../../assets/office.svg';
import CallIcon from '../../assets/call.svg';
import PhoneIcon from '../../assets/phone.svg';
import MailIcon from '../../assets/mail.svg';
import EmailHoverIcon from '../../assets/ts_export.svg';
import tsBgImgIcon from '../../assets/ts_photo.svg';
import starLineIcon from '../../assets/favorites_line.svg';
import starIcon from '../../assets/favorites.svg';

export const Wrapper = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background-image: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)),
    url('${props => props.imageSrc}');
  background-repeat: no-repeat;
  background-size: 100% 100%;
`;

export const Header = styled.div`
  width: 100%;
  height: 2.88rem;
  padding: 0.06rem 0.25rem 0.06rem 0.25rem;
  display: flex;
  align-items: center;
`;
export const TextHeader = styled(Header)`
  padding: 0.06rem 1rem 0.06rem 0.25rem;
`;
export const ButtonBox = styled.div`
  display: flex;
  align-items: center;
  & ~ & {
    margin-left: auto;
  }
`;
export const IconButton = styled(Button)`
  width: 2.75rem;
  height: 2.75rem;
  &:last-of-type {
    margin-left: auto;
  }
`;
export const TextButton = styled(Button)`
  min-width: auto;
  height: auto;
  padding: 0;
  & span {
    color: #fff;
  }
  &.ant-btn-ghost {
    padding: 0.5rem 0 0.5rem;
  }
`;

export const Sidebar = styled.div`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 100%;
  background: rgba(0, 0, 0, 0.4);
`;

export const StyledUpload = styled(Upload)`
  &:focus {
    outline: 0;
  }
`;

export const Text = styled.span`
  overflow: hidden;
  display: block;
  max-width: 14.69rem;
  width: 100%;
  color: #fff;
  line-height: 1.19rem;
  font-size: 0.81rem;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: center;
`;

export const UserEmailText = styled(Text)`
  margin-top: 0.25rem;
  line-height: 1.25rem;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.875rem;
`;

export const ImageChangeButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border: none;
  background-color: #000;
  border-radius: 50%;
  z-index: 5;

  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }

  &:active {
    background-color: #205855;
  }
`;

export const StyledButton = styled(Text)`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  width: 5.38rem;
  height: 5.38rem;
  &:first-of-type {
    margin-top: 0;
  }
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.4);
    border-radius: 4px;
    border-radius: 4px;
    cursor: pointer;
  }
`;

export const Content = styled.div`
  overflow: hidden;
  display: flex;
  position: relative;
  width: 100%;
  height: 90%;
  flex-direction: column;
  align-items: center;
`;

export const ContentTop = styled.div`
  display: flex;
  align-items: left;
  width: 100%;
  height: 1rem;
  padding: 0.94rem 0.94rem 0;
`;

export const ContentBody = styled.div`
  display: flex;
  position: relative;
  width: 100%;
  padding-top: 5.75rem;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const UserImageWrapper = styled.div`
  position: relative;
  width: 7rem;
  height: 7rem;
  background: #fff;
  border-radius: 50%;
  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border: 2px solid rgba(255, 255, 255, 0.2);
    border-radius: 50%;
  }
`;

export const UserImage = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
`;

export const UserInfoList = styled.div`
  width: 100%;
  padding: 4.38rem 5rem 3rem 5rem;
  display: flex;
  flex-direction: column;
`;

export const UserInfoItem = styled.div`
  display: flex;
  align-items: center;
  margin-top: 1.25rem;
  &:first-of-type {
    margin-top: 0;
  }
  em + em {
    display: none;
  }
  &.email {
    em {
      &:last-of-type {
        display: none;
      }
    }
    &:hover {
      cursor: pointer;
      span {
        text-decoration: underline;
      }
      em {
        &:first-of-type {
          display: none;
        }
        &:last-of-type {
          display: block;
        }
      }
    }
  }
  .anticon-lock {
    margin: auto 0;
    padding-left: 0.3125rem;
    font-size: 0.88rem;
    color: #75757f;
  }
`;

export const BigText = styled(Text)`
  margin-top: 1rem;
  line-height: 1.5rem;
  font-size: 1rem;
`;

export const ButtonContainer = styled.div`
  height: 50px;
  margin-top: 1.25rem;
  display: flex;
`;

export const FriendsIcon = styled.span`
  display: inline-block;
  width: 1.88rem;
  height: 1.88rem;
  margin-bottom: 0.5rem;
  background-image: url(${friendsIcon});
  background-repeat: no-repeat;
  background-size: 1.88rem 1.88rem;
`;

export const StyleIcon = styled.span`
  display: inline-block;
  width: 1.88rem;
  height: 1.88rem;
  margin-bottom: 0.5rem;
  background-repeat: no-repeat;
  background-size: 1.88rem 1.88rem;
  ${props => {
    switch (props.iconimg) {
      case 'profile':
      default:
        return css`
          background-image: url(${profileEditIcon});
        `;

      case 'meeting':
        return css`
          background-image: url(${meetingIcon});
        `;
    }
  }}
`;

export const UserInfoText = styled.div`
  overflow: hidden;
  display: flex;
  align-items: center;
  font-size: 0.88rem;
  line-height: 1.25rem;
  color: #fff;
  span {
    display: block;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
`;

export const StyleOfficeIcon = styled.em`
  display: inline-block;
  width: 1.25rem;
  height: 1.25rem;
  flex-shrink: 0;
  margin-right: 0.75rem;
  background-repeat: no-repeat;
  background-size: 1.25rem 1.25rem;
  ${props => {
    switch (props.iconimg) {
      case 'address':
      default:
        return css`
          background-image: url(${OfficeIcon});
        `;

      case 'company':
        return css`
          background-image: url(${CallIcon});
        `;

      case 'phone':
        return css`
          background-image: url(${PhoneIcon});
        `;

      case 'email':
        return css`
          background-image: url(${MailIcon});
        `;

      case 'emailhover':
        return css`
          background-image: url(${EmailHoverIcon});
        `;
    }
  }}
`;

export const EditNameInput = styled(InputCounter)`
  flex-direction: column;
  height: auto;
  padding: 0;
  border: 0 !important;
  border-radius: 0;
  background-color: transparent;
  &:not(:disabled):focus-within {
    input {
      border-color: #7b7671;
    }
  }
  &:hover {
    background-color: transparent;
  }
  input {
    height: 2.25rem;
    margin: 0;
    padding-bottom: 0.56rem;
    border-bottom: 1px solid #fff;
    font-size: 1.5rem;
    text-align: center;
  }
  .input-counter {
    font-size: 0.88rem;
    line-height: 1.25rem;
    color: #fff;
    opacity: 0.7;
  }
`;

export const StyleInput = styled(Input)`
  &.ant-input {
    background-color: transparent;
    border: 0;
    border-bottom: 1px solid #fff;
    border-radius: 0;
    color: #fff;
    font-size: 0.88rem;
    &:hover:not(:disabled),
    &:active:not(:disabled),
    &:focus:not(:disabled) {
      color: #fff;
      background-color: transparent;
    }
    &::placeholder {
      color: #fff;
      opacity: 50%;
    }
    &.type2 {
      text-align: center;
    }
  }
`;

export const StyleBgImgIcon = styled.span`
  width: 1rem;
  height: 1rem;
  background-image: url(${tsBgImgIcon});
  background-repeat: no-repeat;
  background-size: 1rem 1rem;
`;

export const UserStatusMsg = styled.p`
  margin-top: 0.63rem;
  font-size: 0.88rem;
  line-height: 1.25rem;
  color: #ffffff;
  letter-spacing: 0;
  text-align: center;
`;

export const BookMarkButton = styled.button`
  width: 2rem;
  height: 2rem;
  background-color: transparent;
  border-radius: 50%;
  border: 0;
  background: url(${starLineIcon}) no-repeat 50% 50%;
  background-size: 1.13rem 1.13rem;
  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }
  &:active {
    background-color: #205855;
    background-image: url(${starIcon});
  }

  ${props => {
    return css`
      ${props.isFav
        ? `background-image: url(${starIcon});`
        : `background-image: url(${starLineIcon});`}
    `;
  }}
`;

export const Blind = styled.span`
  position: absolute;
  clip: rect(0 0 0 0);
  width: 1px;
  height: 1px;
  margin: -1px;
  overflow: hidden;
`;

export const LockIconBox = styled.div`
  height: 1;
  align-self: flex-start;
  margin: 0.25rem 0 0 0.3125rem;
  color: #75757f;
  line-height: 0;
`;

export const ImageChange = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.5);
`;

export const CameraBox = styled.span`
  line-height: 0;
  z-index: 5;
  cursor: pointer;
`;

export const EditTitle = styled.h3`
  font-size: 1.13rem;
  color: #fff;
  user-select: none;
`;
