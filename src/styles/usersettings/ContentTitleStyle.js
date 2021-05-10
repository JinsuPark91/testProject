import styled from 'styled-components';

export const ContentTitleWrap = styled.div`
  margin: 0 1.25rem;
  padding: 1.25rem 0;
  border-bottom: ${props => (props.divider ? '1px solid #ddd9d4' : '')};
`;

export const Title = styled.p`
  strong {
    font-size: 1.25rem;
    line-height: 1.81rem;
    font-weight: 500;
  }
`;

export const SubTitle = styled.span`
  display: block;
  margin-top: 0.38rem;
  font-size: 0.75rem;
  color: #8d8d8d;
  line-height: 1.13rem;
`;
