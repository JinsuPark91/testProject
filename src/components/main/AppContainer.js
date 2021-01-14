import React, { useEffect } from 'react';
import { Wrapper, SubWrapper } from './AppContainerStyle';

export const MainAppContainer = ({ children }) => {
  return <Wrapper>{children}</Wrapper>;
};

export const SubAppContainer = ({ splitRef, children, layoutState }) => {
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
        }% - ${splitRef.current.props.gutterSize / 2}px)`;
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
  return <SubWrapper>{children}</SubWrapper>;
};
