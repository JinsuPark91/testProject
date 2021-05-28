import styled, { css } from 'styled-components';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 3.125rem;
  height: 100%;
  background-color: ${props => props.theme.StateNormal};
  border-right: 1px solid ${props => props.theme.LineMain};
  padding-bottom: 0.55rem;
`;

export const ItemWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 2rem;
  flex: 0 0 2rem;
  border-radius: 0.375rem;
  background-color: ${({ background, theme }) =>
    background || `${theme.SubStateLight}`};
  font-size: 0.75rem;
  margin-top: 0.813rem;
  cursor: pointer;
`;

export const HorizontalBar = styled.div`
  width: ${({ width }) => width}rem;
  margin-top: 0.55rem;
  border-bottom: 1px solid ${props => props.theme.LineMain};
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
  background-color: ${props => props.theme.SubStateBright};
  color: ${props => props.theme.TextSub4};
  margin: ${props => (props.isDropdown ? '0 0.625rem 0 0' : '0.813rem 0 0 0')};
  cursor: pointer;
  ${props =>
    props.checked &&
    css`
      line-height: 1.625rem;
      border: 2px solid ${props.theme.SpaceLine};
    `}

  ${({ backgroundURL }) =>
    backgroundURL &&
    css`
      background-image: url('${backgroundURL}');
      background-repeat: no-repeat;
      background-size: cover;
      background-position: center;
    `}
`;

export const UnreadSpaceNumber = styled.div`
  display: flex;
  position: absolute;
  top: 0.1rem;
  right: 0.1rem;
  padding: 0 0.125rem;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
  background-color: rgb(220, 69, 71);
  font-size: 0.475rem;
  font-weight: 400;
  line-height: 0.625rem;
  color: rgb(255, 255, 255);
`;

export const DropdownWrapper = styled.div`
  display: flex;
  padding: 0.125rem 0.25rem;
  align-items: center;
  color: ${props => props.theme.TextMain};
  font-size: 0.75rem;
  font-weight: 400;
`;
