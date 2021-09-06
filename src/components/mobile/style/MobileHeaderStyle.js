import styled from 'styled-components';
import { Button } from 'antd';

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  background-color: #fff;
  padding: 0.06rem 1rem 0.06rem 0.25rem;
  z-index: 100;
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
`;

export const FriendHeader = styled(Header)`
  padding: 0.06rem 0.25rem 0.06rem 1rem;
`;

export const HeaderText = styled.h3`
  font-size: 1.13rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const ButtonBox = styled.div`
  display: flex;
  align-items: center;
`;

export const IconButton = styled(Button)`
  width: 2.75rem;
  height: 2.75rem;
  background-color: transparent;
`;

export const TextButton = styled(Button)`
  min-width: auto;
  height: auto;
  padding: 0;
  & span {
    color: #205855;
  }
  &.ant-btn-ghost {
    padding: 0.5rem 0 0.5rem;
  }
`;
