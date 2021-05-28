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
  background: ${props => props.theme.SubStateNormal};
  & .gutter {
    display: flex;
    border-right: 1px solid ${props => props.theme.LineMain};
    align-items: center;
    justify-content: center;
    cursor: ew-resize;
  }

  & .gutter__rect {
    width: 0.15rem;
    height: 1.25rem;
  }

  & .gutter:hover:not(.gutter--active) {
    background: ${props => props.theme.SubStateBright};

    .gutter__rect {
      background: ${props => props.theme.IconNormal};
    }
  }

  & .gutter--active {
    background: ${props => props.theme.SubStateDark};

    .gutter__rect {
      background: #fff;
    }
  }
`;
