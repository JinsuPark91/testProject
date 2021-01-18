import styled from 'styled-components';
import Split from 'react-split';

export const Wrapper = styled.div`
  display: flex;
  width: 100%;
  height: calc(100% - 3.13rem);
`;

export const Splitter = styled(Split)`
  display: flex;
  width: 100%;
  height: 100%;
  & .gutter {
    border-right: 1px solid #e3e7eb;
    cursor: ew-resize;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  & .gutter__rect {
    width: 0.15rem;
    height: 1.25rem;
  }

  & .gutter:hover:not(.gutter--active) {
    background: #d6dbe0;

    .gutter__rect {
      background: #9ba0a4;
    }
  }

  & .gutter--active {
    opacity: 0.7;
    background: #6c56e5;

    .gutter__rect {
      background: #ffffff;
    }
  }
`;
