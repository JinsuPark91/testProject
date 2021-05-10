import styled from 'styled-components';

export const Wrapper = styled.div`
  margin-left: 1.25rem;
`;

export const ThemeList = styled.ul`
  display: flex;
`;

export const ThemeItem = styled.li`
  display: flex;
  flex-direction: column-reverse;
  margin-right: 3.31rem;
  &:last-child {
    margin-right: 0;
  }
  .ant-radio-wrapper {
    font-size: 0.75rem;
    line-height: 0.94rem;
    color: #000;
    .ant-radio {
      input {
        width: 100%;
        height: 100%;
      }
      &-checked {
        .ant-radio-inner {
          border: none;
        }
      }
    }
    &-checked {
      + div {
        background-color: red;
        &:after {
          border: 2px solid #6c56e5;
        }
      }
    }
    .ant-radio-inner {
      position: relative;
      width: 0.94rem;
      height: 0.94rem;
      -webkit-transition: none;
      transition: none;
      &:after {
        content: '';
        display: inline-block;
        position: absolute;
        top: 0.25rem;
        left: 0.25rem;
        width: 0.44rem;
        height: 0.44rem;
        border-radius: 50%;
        -webkit-transition: none;
        transition: none;
      }
    }
  }
`;

export const ThemeImage = styled.div`
  overflow: hidden;
  position: relative;
  margin-bottom: 0.63rem;
  border-radius: 0.63rem;
  :after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    border-radius: 0.63rem;
    border: 1px solid #e3e7eb;
  }
  &.checked:after {
  }
`;

export const ThemeThumb = styled.img`
  width: 100%;
`;
