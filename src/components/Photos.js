import React from 'react';
import styled, { css } from 'styled-components';

const DEFAULT_DIAMETER = 2.25;

const getStyle = (index, count) => {
  const diameter = count > 1 ? DEFAULT_DIAMETER / 2 : DEFAULT_DIAMETER;

  switch (count) {
    case 1:
      return {
        diameter,
        left: 0,
        top: 0,
      };
    case 2:
      return {
        diameter,
        left: index * diameter,
        top: diameter / 2,
      };

    case 3:
      return {
        diameter,
        left: index === 0 ? diameter / 2 : index === 1 ? 0 : diameter,
        top: index === 0 ? 0 : diameter,
      };
    case 4:
      return {
        diameter,
        left: (index % 2) * diameter,
        top: index === 0 || index === 1 ? 0 : diameter,
      };
    default:
      return [];
  }
};

function Photos({ srcList, maxCount }) {
  const srcs = srcList.slice(0, maxCount);

  return (
    <Wrapper>
      {srcs.map((src, index) => (
        <UserPhoto
          key={index}
          src={src}
          styles={getStyle(index, srcs.length)}
        />
      ))}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: ${DEFAULT_DIAMETER}rem;
  height: ${DEFAULT_DIAMETER}rem;
  position: relative;
`;

const UserPhoto = styled.img`
  display: flex;
  ${({ styles: { diameter, left, top } }) => {
    return css`
      width: ${diameter}rem;
      height: ${diameter}rem;
      left: ${left}rem;
      top: ${top}rem;
    `;
  }}

  position: absolute;
  background: white;
  border-radius: 50%;
  border: 0.0625rem solid rgba(0, 0, 0, 0.05);
`;

export default Photos;
