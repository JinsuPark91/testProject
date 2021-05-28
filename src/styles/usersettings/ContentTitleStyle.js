import styled, { css } from 'styled-components';

export const ContentTitleWrap = styled.div`
  margin: 0 1.25rem;
  padding: 1.25rem 0;
  ${props =>
    props.divider &&
    css`
      border-bottom: 1px solid ${props.theme.LineMain};
    `}
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
  color: ${props => props.theme.TextSub};
  line-height: 1.13rem;
`;
