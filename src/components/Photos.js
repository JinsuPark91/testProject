import React from 'react';
import styled, { css } from 'styled-components';

const getStyle = (index, count, defaultDiameter) => {
  const diameter = () => {
    if (count === 2) {
      return defaultDiameter / 1.41;
    }
    if (count === 3) {
      return defaultDiameter / 1.78;
    }
    if (count === 4) {
      return defaultDiameter / 1.88;
    }
    return defaultDiameter;
  };

  switch (count) {
    case 1:
      return {
        diameter,
        left: 0,
      };
    case 2:
      return {
        diameter,
        left: index === 0 && 0,
      };
    case 3:
      return {
        diameter,
        top: index === 0 && 0,
        left: index === 1 && 0,
        bottom: index !== 0 && 0,
      };
    case 4:
      return {
        diameter,
        top: (index === 0 || index === 1) && 0,
        left: (index === 0 || index === 2) && 0,
        right: (index === 1 || index === 3) && 0,
        bottom: (index === 2 || index === 3) && 0,
      };
    default:
      return [];
  }
};

function Photos({
  srcList,
  onClick = () => {},
  defaultDiameter = 2.125,
  className,
}) {
  return (
    <Wrapper
      onClick={e => onClick(e)}
      defaultDiameter={defaultDiameter}
      className={className}
    >
      {srcList.map((src, index) => (
        <UserPhoto
          key={index}
          styles={getStyle(index, srcList.length, defaultDiameter)}
        >
          <img src={src} alt="" />
        </UserPhoto>
      ))}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  position: relative;
  width: ${({ defaultDiameter }) => defaultDiameter}rem;
  height: ${({ defaultDiameter }) => defaultDiameter}rem;
  cursor: pointer;
`;

const UserPhoto = styled.div`
  position: absolute;
  ${({ styles: { diameter, top, left, right, bottom } }) => {
    return css`
      width: ${diameter}rem;
      height: ${diameter}rem;
      top: ${top};
      left: ${left};
      right: ${right};
      bottom: ${bottom};
    `;
  }}
  &:last-child {
    right: 0;
    bottom: 0;
  }
  line-height: 0;

  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border: 1px solid rgba(0, 0, 0, 0.05);
    border-radius: 50%;
  }
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }
`;

export default Photos;
