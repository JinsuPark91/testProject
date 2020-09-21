import React, { useRef, useEffect } from 'react';
import Split from 'react-split';
import styled from 'styled-components';

function Splitter({ layoutState, ...props }) {
  const splitRef = useRef(null);
  useEffect(() => {
    const splitter = splitRef.current.parent;
    const gutter = splitter.childNodes[1];
    const subAppContainer = splitter.childNodes[2];

    switch (layoutState) {
      case 'full':
        gutter.style.display = 'none';
        subAppContainer.style.display = null;
        subAppContainer.style.position = 'absolute';
        subAppContainer.style.height = `${splitter.offsetHeight}px`;
        subAppContainer.style.width = '100%';
        subAppContainer.style.right = 0;
        splitter.style.position = null;
        break;
      case 'expand':
        gutter.style.display = 'none';
        subAppContainer.style.display = null;
        subAppContainer.style.position = 'absolute';
        subAppContainer.style.height = '100%';
        subAppContainer.style.width = '100%';
        subAppContainer.style.right = null;
        splitter.style.position = 'relative';

        break;
      case 'collapse':
        gutter.style.display = null;
        subAppContainer.style.display = null;
        subAppContainer.style.position = null;
        subAppContainer.style.height = null;
        subAppContainer.style.width = `calc(${
          splitRef.current.split.getSizes()[1]
        }% - ${props.gutterSize / 2}px)`;
        splitter.style.position = null;
        break;
      case 'close':
        gutter.style.display = 'none';
        subAppContainer.style.display = 'none';
        subAppContainer.style.position = null;
        subAppContainer.style.height = null;
        splitter.style.position = null;
        break;
      default:
        break;
    }
  });

  return <CustomSplit ref={splitRef} {...props} />;
}

const CustomSplit = styled(Split)`
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

export default Splitter;
