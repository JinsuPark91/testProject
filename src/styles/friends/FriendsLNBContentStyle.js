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
  color: #232d3b;
`;

export const FriendListBox = styled.div`
  &:after {
    content: '';
    display: block;
    height: 1px;
    margin: 0.25rem 0.75rem;
    background-color: #e3e7eb;
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
  color: #000;
`;

export const StyleText = styled(Text)`
  margin-left: 0.25rem;
  font-size: 0.81rem;
  color: #7f7f7f;
`;

export const StyledInfoTitle = styled.p`
  margin-bottom: 0.94rem;
  font-size: 0.94rem;
  line-height: 1.38rem;
  white-space: pre-line;
`;

export const StyledSubInfo = styled.p`
  font-size: 0.75rem;
  line-height: 1.06rem;
  white-space: pre-line;
`;

export const MemberItemWrapper = styled.div`
  &:after {
    display: ${props => (props.noFriend ? 'none' : 'block')};
    content: '';
    height: 1px;
    margin: 0.25rem 0.75rem;
    background-color: #e3e7eb;
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
`;
