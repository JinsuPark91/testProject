import styled from 'styled-components';
import { Typography } from 'antd';

const { Text } = Typography;

export const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  overflow: auto;
  flex: 1;
`;

export const WelcomeWrapper = styled.div`
  margin: auto auto 3.13rem;
  text-align: center;
`;

export const FriendListBox = styled.div`
  &:after {
    content: '';
    display: block;
    height: 1px;
    margin: 0.25rem 0.75rem;
    background-color: ${props => props.theme.LineSub};
  }

  &:last-of-type {
    &:after {
      display: none;
    }
  }
`;

export const StyleTitle = styled.p`
  margin: 0.25rem 0.75rem;
  font-size: 0.75rem;
  line-height: 1.13rem;
  font-weight: 500;
  color: ${props => props.theme.TextMain};
`;

export const StyleText = styled(Text)`
  margin-left: 0.25rem;
  font-size: 0.81rem;
  color: ${props => props.theme.TextSub2};
`;

export const StyledInfoTitle = styled.p`
  margin-bottom: 0.94rem;
  font-size: 0.94rem;
  line-height: 1.38rem;
  color: ${props => props.theme.TextMain};
  white-space: pre-line;
`;

export const StyledSubInfo = styled.p`
  font-size: 0.75rem;
  line-height: 1.06rem;
  color: ${props => props.theme.TextSub};
  white-space: pre-line;
`;

export const MemberItemWrapper = styled.div`
  &:after {
    display: ${props => (props.noFriend ? 'none' : 'block')};
    content: '';
    height: 1px;
    margin: 0.25rem 0.75rem;
    background-color: ${props => props.theme.LineSub};
  }
`;

export const GroupAvatar = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background-color: #205855;
  svg {
    margin-top: -1px;
  }
`;
