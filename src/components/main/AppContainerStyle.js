import styled from 'styled-components';

export const Wrapper = styled.div`
  display: flex;
  flex: auto;
  min-width: 26.25rem;
  background-color: #fff;
`;

export const SubWrapper = styled(Wrapper)`
  min-width: 23.13rem;
  z-index: 5;
  @media (max-width: 1024px) {
    display: none;
  }
`;
