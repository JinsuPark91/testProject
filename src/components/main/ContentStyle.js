import styled from 'styled-components';
import Split from 'react-split';

export const Wrapper = styled.div`
  display: flex;
  width: 100%;
  height: calc(100% - 3.188rem);
`;

export const Splitter = styled(Split)`
  display: flex;
  width: 100%;
  height: 100%;
  & .gutter {
    border-right: 1px solid #e3e7eb;
    border-left: 1px solid #e3e7eb;
  }
  & .gutter:hover {
    cursor: ew-resize;
  }
`;
