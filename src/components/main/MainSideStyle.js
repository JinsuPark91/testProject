import styled from 'styled-components';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: ${props =>
    props.isGroupVisible ? 'calc(100% - 19.315rem)' : 'calc(100% - 16.19rem)'};
  height: 100%;
`;
