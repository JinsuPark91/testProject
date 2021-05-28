import styled from 'styled-components';

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
  .ant-radio-wrapper {
    font-size: 0.75rem;
    line-height: 0.94rem;
    color: ${props => props.theme.TextMain};
    &-checked {
      + div::after {
        border: 2px solid #ec6222;
      }
    }
    span.ant-radio + * {
      padding: 0 0.25rem;
    }
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
    border: 1px solid #e3e7eb;
  }
`;

export const ThemeThumb = styled.img`
  width: 100%;
`;

export const SystemText = styled.span`
  margin-top: 0.5rem;
  font-size: 0.69rem;
  color: #aeaeae;
`;
