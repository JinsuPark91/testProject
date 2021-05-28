/* eslint-disable react/no-array-index-key */
import React from 'react';
import styled, { css } from 'styled-components';
import { WaplSymbol } from './Icons';

const getStyle = (index, count, defaultDiameter) => {
  switch (count) {
    case 1:
      return {
        diameter: defaultDiameter,
        left: 0,
      };
    case 2:
      return {
        diameter: (defaultDiameter / 1.41).toFixed(3),
        left: index === 0 && 0,
      };
    case 3:
      return {
        diameter: (defaultDiameter / 1.78).toFixed(3),
        top: index === 0 && 0,
        left: index === 1 && 0,
        bottom: index !== 0 && 0,
      };
    case 4:
      return {
        diameter: (defaultDiameter / 1.88).toFixed(3),
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
  isBotRoom = false,
  onClick = () => {},
  defaultDiameter = 2.125,
  className,
}) {
  const getPhotos = () => {
    if (srcList.length)
      return srcList.map((src, index) => (
        <UserPhoto
          key={index}
          styles={getStyle(index, srcList.length, defaultDiameter)}
        >
          <img src={src} alt="" />
        </UserPhoto>
      ));

    return (
      <img
        src={`${process.env.PUBLIC_URL}/res/face/Profile_empty_qui.svg`}
        alt=""
      />
    );
  };

  return (
    <Wrapper
      isBotRoom={isBotRoom}
      onClick={e => {
        if (!isBotRoom) onClick(e);
      }}
      defaultDiameter={defaultDiameter}
      className={className}
    >
      {getPhotos()}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  position: relative;
  width: ${({ defaultDiameter }) => defaultDiameter}rem;
  height: ${({ defaultDiameter }) => defaultDiameter}rem;
  cursor: ${({ isBotRoom }) => (isBotRoom ? 'default' : 'pointer')};
  ${({ isBotRoom }) =>
    isBotRoom &&
    css`
      background: linear-gradient(224deg, #ff927e, #49423a);
      padding: 1px;
      border-radius: 50%;
    `}
`;

const SymbolWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background: #fff;
  border-radius: 50%;
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
  border-radius: 50%;
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
    object-fit: cover;
  }
`;

export default Photos;
