import styled, { css } from 'styled-components';

export const Wrapper = styled.div`
  margin-left: 1.25rem;
`;

export const ThemeList = styled.ul`
  display: flex;
`;

export const ThemeItem = styled.li`
  display: flex;
  width: 9.375rem;
  flex-direction: column;
  margin-right: 3.31rem;
  &:last-child {
    margin-right: 0;
  }
`;

export const ThemeImage = styled.div`
  overflow: hidden;
  position: relative;
  margin-bottom: 0.63rem;
  border-radius: 0.63rem;
  &::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    border-radius: 0.63rem;
    border: 1px solid ${props => props.theme.IconHinted};
  }
`;

export const ThemeThumb = styled.img`
  width: 100%;
`;

export const RadioBox = styled.span`
  display: flex;
  align-items: center;
  font-size: 0.75rem;
  line-height: 1.125rem;

  input {
    overflow: hidden;
    position: absolute;
    clip: rect(0 0 0 0);
    margin: -1px;
    width: 1px;
    height: 1px;
  }
`;

export const RadioCircle = styled.span`
  display: inline-block;
  position: relative;
  width: 0.9375rem;
  height: 0.9375rem;
  margin-right: 0.375rem;
  background-color: ${props => props.theme.StateNormal};
  border: 1px solid ${props => props.theme.LineOut};
  border-radius: 50%;
  &:after {
    content: '';
    display: inline-block;
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0.4375rem;
    height: 0.4375rem;
    background-color: #fff;
    border-radius: 50%;
    opacity: 0;
    transform: scale(1) translate(-50%, -50%);
  }
`;

export const RadioWrap = styled.label`
  cursor: pointer;
  margin-bottom: 0;

  ${({ checked }) =>
    checked &&
    css`
      ${ThemeImage}:after {
        border: 0.125rem solid ${props => props.theme.Orange};
      }

      ${RadioCircle} {
        background-color: ${props => props.theme.CoreNormal};
        border-color: ${props => props.theme.CoreNormal};
        &:after {
          opacity: 1;
          transition: all 0.3s cubic-bezier(0.78, 0.14, 0.15, 0.86);
        }
      }
    `}
`;

export const SystemText = styled.span`
  margin-top: 0.5rem;
  font-size: 0.69rem;
  color: ${props => props.theme.TextSub2};
`;
