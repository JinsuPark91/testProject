import styled from 'styled-components';
import { Typography } from 'antd';

const { Text } = Typography;

export const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  overflow: auto;
  flex: 1;
  padding-top: 0;
`;

export const WelcomeWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: auto;
  justify-content: flex-end;
  text-align: center;
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
      display: ${props => (props.noFriend ? '' : 'none')};
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
  color: #000000;
  letter-spacing: 0;
  text-align: center;
  line-height: 1.38rem;
`;

export const StyledSubInfo = styled.p`
  margin-bottom: 1.25rem;
  font-size: 0.75rem;
  color: #414141;
  letter-spacing: 0;
  text-align: center;
  line-height: 1.06rem;
`;
