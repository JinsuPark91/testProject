import styled from 'styled-components';
import { WaplSearch } from 'teespace-core';

export const SearchBox = styled.div`
  display: flex;
  align-items: center;
  padding: 0.5rem 0.75rem;
  .anticon {
    color: #bdc6d3;
  }
  &:hover,
  &:focus {
    .anticon {
      color: #000;
    }
  }
  .ant-input {
    &::placeholder {
      color: #bcbcbc;
    }
  }
`;

export const FriendSearch = styled(WaplSearch)`
  &.friendSearch {
    display: flex;
    flex: 1 1 0%;
    margin-right: 0.63rem;
    height: 1.75rem;
    padding: 0;
  }
`;

export const FriendAddButton = styled.div`
  display: flex;
  width: 2rem;
  height: 2rem;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  background-color: ${props => props.theme.StateNormal};
  box-shadow: 0 0 0.31rem 0 ${props => props.theme.ModalShadow};
  cursor: pointer;

  &:hover {
    background-color: ${props => props.theme.SubStateBright};
  }

  &:active {
    background-color: ${props => props.theme.SubStateDark};
  }

  & > img {
    width: 1.34rem;
    height: 1.34rem;
  }
`;
