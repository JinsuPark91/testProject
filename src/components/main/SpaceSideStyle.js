import styled, { css } from 'styled-components';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 3.125rem;
  height: 100%;
  background-color: #fff;
  border-right: 1px solid #ddd9d4;
  padding-bottom: 0.55rem;
`;

export const ItemWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 2rem;
  flex: 0 0 2rem;
  border-radius: 0.375rem;
  background-color: ${({ background }) => background || '#ebe6df'};
  font-size: 0.75rem;
  margin-top: 0.813rem;
  color: #49423a;
  cursor: pointer;
`;

export const HorizontalBar = styled.div`
  width: ${({ width }) => width}rem;
  margin-top: 0.55rem;
  border-bottom: 1px solid #ddd7ce;
`;

export const SpaceBox = styled.div`
  position: relative;
  width: 2rem;
  height: 2rem;
  font-size: 0.75rem;
  line-height: 1.125rem;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 0.375rem;
  background-color: #ebe6df;
  color: #0a1e3a;
  margin: ${props => (props.isDropdown ? '0 0.625rem 0 0' : '0.813rem 0 0 0')};
  cursor: pointer;
  ${props =>
    props.checked &&
    css`
      line-height: 1.625rem;
      border: 1px solid #0a1e3a;
    `}
`;

export const UnreadSpaceNumber = styled.div`
  position: absolute;
  line-height: 1.025;
  top: 0.1rem;
  right: 0.1rem;
  background-color: rgb(220, 69, 71);
  color: rgb(255, 255, 255);
  font-size: 0.475rem;
  font-weight: 400;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 0.4rem;
  padding: 0 0.2rem;
`;

export const DropdownWrapper = styled.div`
  display: flex;
  padding: 0.125rem 0.25rem;
  align-items: center;
  color: #000000;
  font-size: 0.75rem;
  font-weight: 400;
`;
