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
  width: 100%;
  height: 100%;
  & * {
    user-select: none;
  }
`;
