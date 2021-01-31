import styled from 'styled-components';

export const Loader = styled.div`
    display: flex;
    height: 100%;
    justify-content: center;
    align-items: center;
    user-select: none;

    & img{
      width: 5rem;
      height: auto;
    }
}`;

export const Wrapper = styled.div`
  display: flex;
  position: relative;
  min-width: 65.88rem;
  height: 100%;
  & * {
    user-select: none;
  }
`;
