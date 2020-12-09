import React from 'react';
import styled, { css } from 'styled-components';

const getStyle = (index, count, defaultDiameter) => {
  const diameter = count > 1 ? defaultDiameter / 2 : defaultDiameter;

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

function Photos({ srcList, defaultDiameter = 2.25, center = false }) {
  return (
    <Wrapper defaultDiameter={defaultDiameter} center={center}>
      {srcList.map((src, index) => (
        <UserPhoto
          key={src}
          src={src}
          styles={getStyle(index, srcList.length, defaultDiameter)}
        />
      ))}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 0 0 ${({ defaultDiameter }) => defaultDiameter}rem;
  width: ${({ defaultDiameter }) => defaultDiameter}rem;
  height: ${({ defaultDiameter }) => defaultDiameter}rem;
  position: relative;
  ${props =>
    props.center &&
    css`
      margin: 0 auto;
    `};
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
