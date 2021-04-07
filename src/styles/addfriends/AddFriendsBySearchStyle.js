import { Search } from 'teespace-core';
import styled from 'styled-components';
import { Button, Modal, Avatar } from 'antd';

export const StyledModal = styled(Modal)`
  .ant-modal-body {
    padding: 0;
  }
  .ant-modal-header {
    padding: 0.69rem 0 0.58rem;
  }
  .ant-modal-title {
    font-size: 0.94rem;
    line-height: 1.38rem;
    color: #000000;
    letter-spacing: 0;
  }
`;

export const AddFriendSearchForm = styled.div`
  width: 100%;
  overflow-y: auto;
`;

export const SearchBox = styled.div`
  padding: 0.63rem 0.94rem 0.56rem;
  &:hover {
    .ant-input-prefix {
      .anticon {
        color: #49423a;
      }
    }
  }

  &.ant-input-affix-wrapper {
    .ant-input-prefix {
      .anticon {
        color: #7c7670;
      }
    }
  }

  .ant-input-prefix {
    .anticon {
      color: #cac4bd;
    }
  }

  .ant-input {
    padding: 0.38rem 1.88rem;
    &::placeholder {
      color: #929aa4;
    }
  }
`;

export const StyledSearch = styled(Search)`
  &.openhomeinput {
    &:hover:not(:disabled),
    &:focus:not(:disabled) {
      background-color: #fff;
      border: 1px solid #6c56e5;
    }
  }
`;

export const InvitationForm = styled.div`
  width: 100%;
  padding: 2.5rem 0 3.69rem;
  display: flex;
  flex-flow: column wrap;
  align-items: center;
`;

export const StyledInfoText = styled.p`
  margin-bottom: 0.63rem;
  font-size: 0.94rem;
  word-break: break-all;
  color: #000000;
  letter-spacing: 0;
  text-align: center;
  line-height: 1.38rem;
`;

export const StyledSubInfoText = styled.p`
  margin-bottom: 1.25rem;
  font-size: 0.75rem;
  word-break: break-all;
  color: #696969;
  letter-spacing: 0;
  text-align: center;
  line-height: 1.13rem;
`;

export const StyledInfoImg = styled.img`
  width: 8.13rem;
  margin-bottom: 1rem;
`;

export const StyledButton = styled(Button)`
    width: 5.13rem;
    height: 1.88rem;
    font-size: 0.75rem;
    background-color:
    color: #FFFFFF;
    letter-spacing: 0;
    text-align: center;
`;

export const Logo = styled(Avatar)`
  flex-shrink: 0;
  font-size: 0.88rem;
  font-weight: 500;
  border-radius: 0.5rem;
  margin-right: 0.38rem;
`;
